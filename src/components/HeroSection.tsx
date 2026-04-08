import { Link } from "react-router-dom";
import logoAndre from "@/assets/logo-andre.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/80" />
      
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <div className="mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-8 rounded-full bg-secondary/50 flex items-center justify-center shadow-gold">
          <img
            src={logoAndre}
            alt="Barbearia André - Desde 2003"
            className="w-40 h-40 sm:w-56 sm:h-56 object-contain"
            width={512}
            height={512}
          />
        </div>
        <h1 className="text-gold-gradient text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4">
          Barbearia André
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl mb-2">
          Uma nova experiência para uma antiga tradição.
        </p>
        <p className="text-muted-foreground mb-8">Desde 2003</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/agendar"
            className="bg-gold-gradient text-primary-foreground px-8 py-3 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Agendar Agora
          </Link>
          <button
            onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-primary/30 text-primary px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary/10 transition-colors"
          >
            Ver Serviços
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
