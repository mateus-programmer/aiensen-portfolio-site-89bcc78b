import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, Mail, ArrowLeft, Zap } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else {
        toast.success("Login realizado com sucesso!");
        navigate(redirectTo);
      }
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, displayName);
      if (error) toast.error(error.message);
      else toast.success("Conta criada! Verifique seu email para confirmar.");
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Enviamos um link de recuperação para seu email.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  const title = mode === "login" ? "Acesse sua conta" : mode === "signup" ? "Crie sua conta" : "Recuperar acesso";

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            <span className="neon-text-yellow">AI</span>
            <span className="text-foreground">ensen</span>
          </h1>
          <p className="font-alt text-sm text-muted-foreground">{title}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-card border border-border rounded-xl p-8 space-y-5 overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <AnimatePresence mode="wait">
            {mode === "forgot" ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <Zap className="text-primary mt-0.5 shrink-0" size={16} />
                  <p className="font-alt text-xs text-muted-foreground leading-relaxed">
                    Informe o email cadastrado. Enviaremos um link seguro para criar uma nova senha.
                  </p>
                </div>

                <div>
                  <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-all hover:shadow-[0_0_30px_hsl(48_100%_50%/0.4)] disabled:opacity-50 active:scale-[0.98]"
                >
                  <Mail size={16} />
                  {loading ? "Enviando..." : "Enviar link"}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full inline-flex items-center justify-center gap-1.5 font-alt text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft size={12} /> Voltar ao login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {mode === "signup" && (
                  <div>
                    <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-alt text-xs text-muted-foreground uppercase tracking-wider">
                      Senha
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="group inline-flex items-center gap-1 font-alt text-[10px] text-primary/80 hover:text-primary uppercase tracking-wider transition-colors"
                      >
                        <KeyRound size={10} className="group-hover:rotate-12 transition-transform" />
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-all hover:shadow-[0_0_30px_hsl(48_100%_50%/0.4)] disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar Conta"}
                </button>

                <p className="text-center font-body text-sm text-muted-foreground">
                  {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-primary hover:underline font-semibold"
                  >
                    {mode === "login" ? "Criar conta" : "Fazer login"}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="font-alt text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
