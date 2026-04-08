import { Link } from "react-router-dom";
import { Clock, Scissors } from "lucide-react";

const services = [
  { name: "Corte de Cabelo", price: "R$ 50,00", duration: "45 min" },
  { name: "Design de Barba", price: "R$ 50,00", duration: "30 min", plan: true },
  { name: "Cabelo & Barba", price: "R$ 100,00", duration: "60 min" },
  { name: "Pezinho", price: "R$ 15,00", duration: "15 min", plan: true },
  { name: "Máquina no Cabelo", price: "R$ 35,00", duration: "30 min", plan: true },
  { name: "Máquina na Barba", price: "R$ 35,00", duration: "30 min", plan: true },
  { name: "Selagem", price: "A partir de R$ 80,00", duration: "45 min", plan: true },
  { name: "Hidratação", price: "R$ 40,00", duration: "30 min" },
];

const categories = ["AVULSO", "Club", "EXTRA"];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-gold-gradient text-3xl sm:text-4xl font-heading font-bold text-center mb-4">
          Nossos Serviços
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Clique no item para obter informações
        </p>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-1.5 rounded-full border border-primary/30 text-sm text-foreground/80 hover:bg-primary/10 cursor-pointer transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between bg-card rounded-lg p-4 border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  {service.plan && (
                    <span className="inline-block text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-1">
                      ⭐ Plano disponível
                    </span>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-primary text-sm font-semibold">{service.price}</span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/agendar"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Agendar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
