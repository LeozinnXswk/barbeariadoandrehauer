import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { barber_id, title, body, url } = await req.json();
    if (!barber_id || !title) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: barber } = await admin
      .from("barbers")
      .select("user_id")
      .eq("id", barber_id)
      .maybeSingle();
    if (!barber?.user_id) {
      return new Response(JSON.stringify({ sent: 0, reason: "Barbeiro sem conta vinculada" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: subs } = await admin
      .from("push_subscriptions")
      .select("id,endpoint,p256dh,auth")
      .eq("user_id", barber.user_id);

    if (!subs?.length) {
      return new Response(JSON.stringify({ sent: 0, reason: "Nenhum celular cadastrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    webpush.setVapidDetails(
      Deno.env.get("VAPID_SUBJECT") ?? "mailto:contato@barbearia.com",
      Deno.env.get("VAPID_PUBLIC_KEY")!,
      Deno.env.get("VAPID_PRIVATE_KEY")!
    );

    const payload = JSON.stringify({ title, body: body ?? "", url: url ?? "/painel" });
    let sent = 0;

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        console.error("push failed", status, (err as Error).message);
        if (status === 404 || status === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});