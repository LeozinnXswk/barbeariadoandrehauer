import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Scissors, Calendar, User } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const services = [
  { id: 1, name: "Cabelo", price: 50, duration: "45 min" },
  { id: 2, name: "Barba", price: 40, duration: "30 min" },
  { id: 3, name: "Cabelo e Barba", price: 80, duration: "60 min" },
  { id: 4, name: "Pé de Cabelo", price: 20, duration: "15 min" },
  { id: 5, name: "Sobrancelha", price: 20, duration: "15 min" },
  { id: 6, name: "Depilação de Orelha e Nariz", price: 10, duration: "10 min" },
];

const allTimeSlots = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "13:30","14:00","14:30","15:00","15:30","16:00",
  "16:30","17:00","17:30","18:00","18:30","19:00","19:30",
];

type Barber = { id: string; name: string; phone: string | null };

const Agendar = () => {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [busy, setBusy] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    supabase.from("barbers").select("id,name,phone").eq("active", true).order("name")
      .then(({ data }) => setBarbers((data ?? []) as Barber[]));
  }, []);

  useEffect(() => {
    if (!barber || !date) { setBusy([]); return; }
    supabase.rpc("get_busy_slots", { _barber_id: barber.id, _date: date }).then(({ data }) => {
      setBusy(((data as any[]) ?? []).map((r) => (r.appointment_time as string).slice(0, 5)));
    });
  }, [barber, date]);

  const service = services.find((s) => s.id === serviceId);

  const confirmBooking = async () => {
    if (!user || !service || !barber || !date || !time) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        client_id: user.id,
        barber_id: barber.id,
        service_name: service.name,
        service_price: service.price,
        appointment_date: date,
        appointment_time: time,
      });
      if (error) throw error;

      // Buscar nome do cliente
      const { data: profile } = await supabase.from("profiles").select("full_name,phone").eq("user_id", user.id).maybeSingle();
      const clientName = profile?.full_name || user.email;
      const clientPhone = profile?.phone || "";
      const dateBR = new Date(date + "T12:00").toLocaleDateString("pt-BR");

      toast.success("Agendamento confirmado!");

      if (barber.phone) {
        const msg = `*Novo agendamento - Barbearia do André*%0A%0A👤 Cliente: ${clientName}%0A📞 Telefone: ${clientPhone}%0A✂️ Serviço: ${service.name}%0A💰 Valor: R$ ${service.price.toFixed(2)}%0A📅 Data: ${dateBR}%0A🕐 Horário: ${time}`;
        window.open(`https://wa.me/${barber.phone}?text=${msg}`, "_blank");
      }

      navigate("/");
    } catch (err: any) {
      toast.error(err.message?.includes("duplicate") ? "Esse horário acabou de ser reservado." : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
          <img src={logoAndre} alt="" className="h-8 w-8 object-contain" />
          <span className="text-gold-gradient font-heading font-bold">Agendamento</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              s === step ? "bg-gold-gradient text-primary-foreground" : s < step ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}>{s}</div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5" /> Escolha o Serviço
            </h2>
            <div className="space-y-3">
              {services.map((s) => (
                <button key={s.id} onClick={() => { setServiceId(s.id); setStep(2); }}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border text-left ${
                    serviceId === s.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
                  }`}>
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-primary text-sm">R$ {s.price.toFixed(2)}</span>
                      <span className="text-muted-foreground text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Escolha o Profissional
            </h2>
            <div className="space-y-3">
              {barbers.map((b) => (
                <button key={b.id} onClick={() => { setBarber(b); setStep(3); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left ${
                    barber?.id === b.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
                  }`}>
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-heading font-bold text-lg">
                    {b.name[0]}
                  </div>
                  <span className="font-semibold text-foreground">{b.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-muted-foreground text-sm hover:text-primary">← Voltar</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Data e Horário
            </h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">Data</label>
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setTime(null); }}
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                min={new Date().toISOString().split("T")[0]} />
            </div>
            {date && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {allTimeSlots.map((t) => {
                    const isBusy = busy.includes(t);
                    return (
                      <button key={t} disabled={isBusy}
                        onClick={() => { setTime(t); setStep(4); }}
                        className={`py-2 rounded-md text-sm font-medium relative ${
                          isBusy ? "bg-secondary/50 text-muted-foreground line-through cursor-not-allowed"
                          : time === t ? "bg-gold-gradient text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary/30"
                        }`}>
                        {t}
                      </button>
                    );
                  })}
                </div>
                {busy.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">Horários riscados já estão ocupados.</p>
                )}
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-4 text-muted-foreground text-sm hover:text-primary">← Voltar</button>
          </div>
        )}

        {step === 4 && service && barber && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-6">Confirmar Agendamento</h2>
            <div className="bg-card rounded-lg border border-border p-6 space-y-4 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Serviço</span><span className="text-foreground font-semibold">{service.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Profissional</span><span className="text-foreground font-semibold">{barber.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span className="text-foreground font-semibold">{new Date(date + "T12:00").toLocaleDateString("pt-BR")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Horário</span><span className="text-foreground font-semibold">{time}</span></div>
              <div className="flex justify-between border-t border-border pt-4"><span className="text-muted-foreground">Valor</span><span className="text-primary font-bold">R$ {service.price.toFixed(2)}</span></div>
            </div>
            <button disabled={submitting} onClick={confirmBooking}
              className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50">
              {submitting ? "Confirmando..." : "Confirmar e Avisar Barbeiro no WhatsApp"}
            </button>
            <button onClick={() => setStep(3)} className="mt-4 text-muted-foreground text-sm hover:text-primary block mx-auto">← Voltar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendar;