import { Wifi, Car, Accessibility, Wind } from "lucide-react";

const amenities = [
  { icon: Wifi, label: "Wi-Fi" },
  { icon: Car, label: "Estacionamento" },
  { icon: Accessibility, label: "Acessibilidade" },
  { icon: Wind, label: "Ar Condicionado" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-gold-gradient text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
          Sobre Nós
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h3 className="text-primary font-heading text-xl font-semibold mb-4">Comodidades</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {amenities.map((a) => (
                <div
                  key={a.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border"
                >
                  <a.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm text-muted-foreground">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-primary font-heading text-xl font-semibold mb-4">
              Horário de Atendimento
            </h3>
            <div className="bg-card rounded-lg border border-border p-6 space-y-3">
              {[
                { day: "Segunda-Feira", hours: "10:00 - 20:00" },
                { day: "Terça-Feira", hours: "10:00 - 20:00" },
                { day: "Quarta-Feira", hours: "10:00 - 20:00" },
                { day: "Quinta-Feira", hours: "10:00 - 20:00" },
                { day: "Sexta-Feira", hours: "10:00 - 20:00" },
                { day: "Sábado", hours: "10:00 - 18:00" },
                { day: "Domingo", hours: "Fechado" },
              ].map((item) => {
                const today = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
                const isToday = today.toLowerCase().includes(item.day.toLowerCase().split("-")[0].trim());
                return (
                  <div key={item.day} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isToday ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                        {item.day}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Hoje
                        </span>
                      )}
                    </div>
                    <span className={`text-sm ${isToday ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {item.hours}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
