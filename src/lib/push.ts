import { supabase } from "@/integrations/supabase/client";

export const VAPID_PUBLIC_KEY =
  "BORd_ItsCI6_aER5Thb9zqJh7UYYUoAYzaAbXp5qzkzsrRMUTGSGMVuILLNnLLPKUPDMnQUG42KSRwWDHCljlAk";

export const pushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

const getRegistration = () => navigator.serviceWorker.register("/push-sw.js");

export const isPushEnabled = async () => {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
  const sub = await reg?.pushManager.getSubscription();
  return !!sub;
};

export const enablePush = async (userId: string) => {
  if (!pushSupported()) throw new Error("Seu navegador não suporta notificações.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permissão de notificação negada.");

  const reg = await getRegistration();
  await navigator.serviceWorker.ready;

  const existing = await reg.pushManager.getSubscription();
  const sub =
    existing ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: json.endpoint!,
      p256dh: json.keys!.p256dh!,
      auth: json.keys!.auth!,
    },
    { onConflict: "endpoint" }
  );
  if (error) throw error;
};

export const disablePush = async () => {
  const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
  const sub = await reg?.pushManager.getSubscription();
  if (sub) {
    const endpoint = sub.endpoint;
    await sub.unsubscribe();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  }
};