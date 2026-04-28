import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, AlertTriangle, Mail, Send } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [resendEmail, setResendEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const e = localStorage.getItem("aiensen:recovery_email") || "";
      setSavedEmail(e);
      setResendEmail(e);
    } catch {}
  }, []);

  useEffect(() => {
    // 1. Detect explicit error in URL hash (expired/invalid recovery link)
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const errorCode = hashParams.get("error_code") || hashParams.get("error");
    const errorDescription = hashParams.get("error_description");

    if (errorCode) {
      const isExpired = errorCode === "otp_expired" || /expired/i.test(errorDescription || "");
      const msg = isExpired
        ? "Seu link de recuperação expirou. Solicite um novo email de redefinição."
        : "Link de recuperação inválido. Solicite um novo email de redefinição.";
      setLinkError(msg);
      toast.error(msg);
      return;
    }

    // 2. Otherwise wait for Supabase to set the recovery session via hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // 3. Fallback: if no session and no error after 5s, treat as invalid
    const fallback = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          const msg = "Link de recuperação inválido ou expirado. Solicite um novo.";
          setLinkError(msg);
          toast.error(msg);
          setTimeout(() => navigate("/auth", { replace: true }), 3000);
        }
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      const expired = /expired|invalid|jwt|session/i.test(error.message);
      if (expired) {
        const msg = "Sua sessão de recuperação expirou. Redirecionando para o login...";
        setLinkError(msg);
        toast.error(msg);
        setTimeout(() => navigate("/auth", { replace: true }), 3000);
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Senha redefinida com sucesso!");
      await supabase.auth.signOut();
      navigate("/auth");
    }
  };

  if (linkError) {
    return (
      <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-destructive/40 bg-destructive/5 mb-4 shadow-[0_0_30px_hsl(var(--destructive)/0.25)]">
            <AlertTriangle className="text-destructive" size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight mb-3 text-foreground uppercase">
            Link Inválido
          </h1>
          <div className="bg-card border border-destructive/30 rounded-xl p-6 mb-6">
            <p className="font-alt text-sm text-muted-foreground leading-relaxed">{linkError}</p>
          </div>
          <p className="font-alt text-xs text-muted-foreground uppercase tracking-wider animate-pulse">
            Redirecionando para o login...
          </p>
          <button
            onClick={() => navigate("/auth", { replace: true })}
            className="mt-4 font-alt text-xs text-primary hover:underline uppercase tracking-wider"
          >
            Ir agora →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-primary/40 bg-primary/5 mb-4 shadow-[0_0_30px_hsl(48_100%_50%/0.25)]">
            <ShieldCheck className="text-primary" size={26} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            <span className="neon-text-yellow">REDEFINIR</span>
            <span className="text-foreground"> SENHA</span>
          </h1>
          <p className="font-alt text-sm text-muted-foreground uppercase tracking-wider">
            // Defina uma nova credencial de acesso
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-card border border-border rounded-xl p-8 space-y-5 overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {!ready && (
            <p className="font-alt text-xs text-muted-foreground text-center uppercase tracking-wider">
              Validando link de recuperação...
            </p>
          )}

          <div>
            <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
              Nova senha
            </label>
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

          <div>
            <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
              Confirmar senha
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !ready}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-all hover:shadow-[0_0_30px_hsl(48_100%_50%/0.4)] disabled:opacity-50 active:scale-[0.98]"
          >
            <KeyRound size={16} />
            {loading ? "Atualizando..." : "Redefinir Senha"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/auth" className="font-alt text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar ao login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
