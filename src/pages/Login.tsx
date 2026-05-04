import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoAndre from "@/assets/logo-andre.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        toast.success("Conta criada com sucesso!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoAndre} alt="Barbearia André" className="w-24 h-24 mx-auto object-contain mb-4" />
          </Link>
          <h1 className="text-gold-gradient text-2xl font-heading font-bold">
            {isSignup ? "Criar Conta" : "Entrar"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignup ? "Preencha os dados para se cadastrar" : "Acesse sua conta"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Nome completo</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Seu nome" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Telefone</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="(41) 99999-9999" />
              </div>
            </>
          )}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Senha</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Aguarde..." : isSignup ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <button onClick={handleGoogle}
          className="w-full bg-card border border-border text-foreground py-3 rounded-md font-semibold hover:bg-secondary transition-colors">
          Continuar com Google
        </button>

        <p className="text-center text-muted-foreground text-sm mt-6">
          {isSignup ? "Já tem uma conta?" : "Não tem conta?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline">
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