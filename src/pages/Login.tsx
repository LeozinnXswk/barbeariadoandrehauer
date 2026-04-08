import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src={logoAndre}
              alt="Barbearia André"
              className="w-24 h-24 mx-auto object-contain mb-4"
              loading="lazy"
              width={512}
              height={512}
            />
          </Link>
          <h1 className="text-gold-gradient text-2xl font-heading font-bold">
            {isSignup ? "Criar Conta" : "Entrar"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignup ? "Preencha os dados para se cadastrar" : "Acesse sua conta"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nome completo</label>
              <input
                type="text"
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Seu nome"
              />
            </div>
          )}
          {isSignup && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Telefone</label>
              <input
                type="tel"
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="(41) 99999-9999"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">E-mail</label>
            <input
              type="email"
              className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            {isSignup ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          {isSignup ? "Já tem uma conta?" : "Não tem conta?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary hover:underline"
          >
            {isSignup ? "Entrar" : "Cadastrar-se"}
          </button>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-muted-foreground text-sm hover:text-primary transition-colors">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
