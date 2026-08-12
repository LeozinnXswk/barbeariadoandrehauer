import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Serviços", path: "/#servicos" },
  { label: "Sobre", path: "/#sobre" },
  { label: "Contato", path: "/#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, roles, signOut } = useAuth();
  const isBarber = roles.includes("barber") || roles.includes("admin");

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAndre} alt="Barbearia André" className="h-12 w-12 object-contain" />
          <span className="text-gold-gradient font-heading text-lg font-bold hidden sm:block">
            Barbearia André
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.path.includes("#")) {
                  scrollTo(link.path.split("#")[1]);
                }
              }}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/login"
            className="text-sm text-foreground/70 hover:text-primary transition-colors"
          >
            {user ? "Minha Conta" : "Entrar"}
          </Link>
          {isBarber && (
            <Link to="/painel" className="text-sm text-primary hover:underline">Painel</Link>
          )}
          {user ? (
            <button
              onClick={() => signOut()}
              className="bg-gold-gradient text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sair Agora
            </button>
          ) : (
            <Link
              to="/agendar"
              className="bg-gold-gradient text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Agendar Agora
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.path.includes("#")) {
                  scrollTo(link.path.split("#")[1]);
                }
              }}
              className="block w-full text-left text-foreground/70 hover:text-primary transition-colors py-2"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block text-foreground/70 hover:text-primary transition-colors py-2"
          >
            {user ? "Minha Conta" : "Entrar"}
          </Link>
          {isBarber && (
            <Link to="/painel" onClick={() => setOpen(false)} className="block text-primary py-2">Painel do Barbeiro</Link>
          )}
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="block bg-gold-gradient text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold text-center w-full"
          >
            Sair Agora
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
