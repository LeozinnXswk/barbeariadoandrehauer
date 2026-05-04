import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, LogOut } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Você verá apenas os agendamentos vinculados ao seu cadastro de barbeiro.
        </p>
      </div>
    </div>
  );
};

export default Painel;