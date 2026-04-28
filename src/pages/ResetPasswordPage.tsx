import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, AlertTriangle, Mail, Send, Timer } from "lucide-react";

const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = "aiensen:recovery_cooldown_until";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [resendEmail, setResendEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const e = localStorage.getItem("aiensen:recovery_email") || "";
      setSavedEmail(e);
      setResendEmail(e);
      const until = parseInt(localStorage.getItem(COOLDOWN_KEY) || "0", 10);
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      if (remaining > 0) setCooldown(remaining);
    } catch {}
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

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
        const msg = "Sua sessão de recuperação expirou. Solicite um novo link abaixo.";
        setLinkError(msg);
        toast.error(msg);
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Senha redefinida com sucesso!");
      await supabase.auth.signOut();
      navigate("/auth");
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast.error(`Aguarde ${cooldown}s antes de solicitar novamente.`);
      return;
    }
    if (!resendEmail || !/^\S+@\S+\.\S+$/.test(resendEmail)) {
      toast.error("Informe um email válido.");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResending(false);
    if (error) {
      // Supabase rate-limit message handling
      const match = /(\d+)\s*second/i.exec(error.message);
      if (match) {
        const secs = parseInt(match[1], 10);
        const until = Date.now() + secs * 1000;
        try { localStorage.setItem(COOLDOWN_KEY, String(until)); } catch {}
        setCooldown(secs);
        toast.error(`Muitas tentativas. Tente novamente em ${secs}s.`);
      } else {
        toast.error(error.message);
      }
      return;
    }
    try {
      localStorage.setItem("aiensen:recovery_email", resendEmail);
      const until = Date.now() + COOLDOWN_SECONDS * 1000;
      localStorage.setItem(COOLDOWN_KEY, String(until));
    } catch {}
    setCooldown(COOLDOWN_SECONDS);
    toast.success("Novo link enviado! Verifique seu email.");
    setTimeout(() => navigate("/auth", { replace: true }), 1500);
  };

  if (linkError) {
    return (
      <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-destructive/40 bg-destructive/5 mb-4 shadow-[0_0_30px_hsl(var(--destructive)/0.25)]">
              <AlertTriangle className="text-destructive" size={26} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight mb-3 text-foreground uppercase">
              Link Inválido
            </h1>
          </div>

          <div className="bg-card border border-destructive/30 rounded-xl p-6 mb-4">
            <p className="font-alt text-sm text-muted-foreground leading-relaxed text-center">
              {linkError}
            </p>
          </div>

          <form
            onSubmit={handleResend}
            className="relative bg-card border border-border rounded-xl p-6 space-y-4 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div>
              <label className="block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                Email para reenvio
              </label>
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="seu@email.com"
              />
              {savedEmail && (
                <p className="mt-1.5 font-alt text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                  // Email da última solicitação preenchido automaticamente
                </p>
              )}
            </div>

            {cooldown > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5">
                <Timer size={14} className="text-primary animate-pulse shrink-0" />
                <p className="font-alt text-[11px] text-muted-foreground uppercase tracking-wider">
                  Aguarde <span className="text-primary font-semibold">{cooldown}s</span> para reenviar novamente
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={resending || cooldown > 0}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-all hover:shadow-[0_0_30px_hsl(48_100%_50%/0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {cooldown > 0 ? (
                <><Timer size={16} /> Aguarde {cooldown}s</>
              ) : resending ? (
                <><Mail size={16} className="animate-pulse" /> Enviando...</>
              ) : (
                <><Send size={16} /> Reenviar link de recuperação</>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/auth", { replace: true })}
              className="w-full font-alt text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              ← Voltar ao login
            </button>
          </form>
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
