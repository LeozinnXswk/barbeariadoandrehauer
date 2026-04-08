import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Scissors, Calendar, User } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";

const services = [
  { id: 1, name: "Corte de Cabelo", price: "R$ 50,00", duration: "45 min" },
  { id: 2, name: "Design de Barba", price: "R$ 50,00", duration: "30 min" },
  { id: 3, name: "Cabelo & Barba", price: "R$ 100,00", duration: "60 min" },
  { id: 4, name: "Pezinho", price: "R$ 15,00", duration: "15 min" },
  { id: 5, name: "Máquina no Cabelo", price: "R$ 35,00", duration: "30 min" },
  { id: 6, name: "Máquina na Barba", price: "R$ 35,00", duration: "30 min" },
  { id: 7, name: "Selagem", price: "A partir de R$ 80,00", duration: "45 min" },
  { id: 8, name: "Hidratação", price: "R$ 40,00", duration: "30 min" },
];

const barbers = ["André", "Carlos", "Felipe"];

const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00",
  "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const Agendar = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <img src={logoAndre} alt="" className="h-8 w-8 object-contain" />
          <span className="text-gold-gradient font-heading font-bold">Agendamento</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                s === step
                  ? "bg-gold-gradient text-primary-foreground"
                  : s < step
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5" /> Escolha o Serviço
            </h2>
            <div className="space-y-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s.id); setStep(2); }}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                    selectedService === s.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-primary text-sm">{s.price}</span>
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />{s.duration}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber */}
        {step === 2 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Escolha o Profissional
            </h2>
            <div className="space-y-3">
              {barbers.map((b) => (
                <button
                  key={b}
                  onClick={() => { setSelectedBarber(b); setStep(3); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                    selectedBarber === b
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-heading font-bold text-lg">
                    {b[0]}
                  </div>
                  <span className="font-semibold text-foreground">{b}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-muted-foreground text-sm hover:text-primary">
              ← Voltar
            </button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Data e Horário
            </h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {selectedDate && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTime(t); setStep(4); }}
                      className={`py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTime === t
                          ? "bg-gold-gradient text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-4 text-muted-foreground text-sm hover:text-primary">
              ← Voltar
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div>
            <h2 className="text-primary font-heading text-xl font-semibold mb-6">Confirmar Agendamento</h2>
            <div className="bg-card rounded-lg border border-border p-6 space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviço</span>
                <span className="text-foreground font-semibold">
                  {services.find((s) => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional</span>
                <span className="text-foreground font-semibold">{selectedBarber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="text-foreground font-semibold">
                  {selectedDate && new Date(selectedDate + "T12:00").toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horário</span>
                <span className="text-foreground font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="text-muted-foreground">Valor</span>
                <span className="text-primary font-bold">
                  {services.find((s) => s.id === selectedService)?.price}
                </span>
              </div>
            </div>
            <button
              className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              onClick={() => {
                alert("Agendamento confirmado! (Funcionalidade completa requer backend)");
              }}
            >
              Confirmar Agendamento
            </button>
            <button onClick={() => setStep(3)} className="mt-4 text-muted-foreground text-sm hover:text-primary block mx-auto">
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendar;
