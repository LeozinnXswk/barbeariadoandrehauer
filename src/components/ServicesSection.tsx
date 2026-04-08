import { Link } from "react-router-dom";
import { Clock, Scissors } from "lucide-react";

const services = [
  { name: "Cabelo", price: "R$ 50,00", duration: "45 min" },
  { name: "Barba", price: "R$ 40,00", duration: "30 min" },
  { name: "Cabelo e Barba", price: "R$ 80,00", duration: "60 min" },
  { name: "Pé de Cabelo", price: "R$ 20,00", duration: "15 min" },
  { name: "Sobrancelha", price: "R$ 20,00", duration: "15 min" },
  { name: "Depilação de Orelha e Nariz", price: "R$ 10,00", duration: "10 min" },
];

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
