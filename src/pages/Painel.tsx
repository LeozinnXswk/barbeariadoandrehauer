import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, CalendarPlus, Download, LogOut } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BARBERSHOP_ADDRESS, CalendarEvent, downloadIcs, googleCalendarUrl } from "@/lib/calendar";

type Appt = {
  id: string;
  client_id: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  client_name?: string;
  client_phone?: string;
};

const Painel = () => {
  const { user, loading, signOut } = useAuth();
  const [appts, setAppts] = useState<Appt[]>([]);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [busy, setBusy] = useState(true);
  const navigate = useNavigate();

  const toEvent = (a: Appt): CalendarEvent => ({
    title: `${a.service_name} - ${a.client_name || "Cliente"}`,
    description: `Cliente: ${a.client_name || "Cliente"}${a.client_phone ? ` (${a.client_phone})` : ""}\nServiço: ${a.service_name}\nValor: R$ ${Number(a.service_price).toFixed(2)}`,
    location: BARBERSHOP_ADDRESS,
    date: a.appointment_date,
    time: a.appointment_time.slice(0, 5),
    durationMinutes: 40,
  });

  const activeAppts = appts.filter((a) => a.status !== "cancelled");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      const { data: rows } = await supabase
        .from("appointments")
        .select("*")
        .eq("appointment_date", filterDate)
        .order("appointment_time");
      const list = (rows ?? []) as Appt[];
      // fetch profiles
      const ids = Array.from(new Set(list.map((a) => a.client_id)));
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("user_id,full_name,phone").in("user_id", ids);
        const map = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
        list.forEach((a) => {
          const p = map.get(a.client_id);
          a.client_name = p?.full_name;
          a.client_phone = p?.phone;
        });
      }
      setAppts(list);
      setBusy(false);
    })();
  }, [user, filterDate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
            <img src={logoAndre} alt="" className="h-8 w-8 object-contain" />
            <span className="text-gold-gradient font-heading font-bold">Painel do Barbeiro</span>
          </div>
          <button onClick={() => { signOut(); navigate("/"); }} className="text-muted-foreground hover:text-primary">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Agenda do dia
          </label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            className="bg-card border border-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {busy ? (
          <p className="text-muted-foreground text-center py-12">Carregando...</p>
        ) : appts.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhum agendamento para essa data.</p>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => downloadIcs(activeAppts.map(toEvent), `agenda-${filterDate}.ics`)}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground px-4 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" /> Enviar o dia todo para a agenda do celular
            </button>
            {appts.map((a) => (
              <div key={a.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary font-heading font-bold text-lg">{a.appointment_time.slice(0, 5)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${a.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}>
                    {a.status === "cancelled" ? "Cancelado" : "Confirmado"}
                  </span>
                </div>
                <p className="text-foreground font-semibold">{a.client_name || "Cliente"}</p>
                <p className="text-muted-foreground text-sm">{a.service_name} • R$ {Number(a.service_price).toFixed(2)}</p>
                {a.client_phone && (
                  <a href={`https://wa.me/55${a.client_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="text-primary text-sm hover:underline mt-2 inline-block">
                    WhatsApp: {a.client_phone}
                  </a>
                )}
                {a.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <a
                      href={googleCalendarUrl(toEvent(a))}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 border border-primary/50 text-primary text-xs px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <CalendarPlus className="w-3 h-3" /> Google Agenda
                    </a>
                    <button
                      onClick={() => downloadIcs([toEvent(a)], `agendamento-${a.appointment_date}-${a.appointment_time.slice(0, 5)}.ics`)}
                      className="flex items-center gap-1 border border-border text-foreground/80 text-xs px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Download className="w-3 h-3" /> Agenda do celular (.ics)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Você verá apenas os agendamentos vinculados ao seu cadastro de barbeiro. Toque em "Google Agenda" ou baixe o arquivo .ics para que o horário apareça direto na agenda do seu celular.
        </p>
      </div>
    </div>
  );
};

export default Painel;