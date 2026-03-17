import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const FooterSection = () => {
  return (
    <footer id="contato" className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight mb-4">
          <span className="neon-text-yellow">AI</span>
          <span className="text-foreground">ensen</span>
        </h2>
        <p className="font-alt text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          All In One With AI — Sua biblioteca tecnológica futurista.
        </p>

        <div className="flex justify-center gap-6 mb-10">
          {[
            { icon: Mail, href: "mailto:contato@aiensen.com", label: "Email" },
            { icon: Instagram, href: "#", label: "Instagram" },
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all hover:shadow-[0_0_15px_hsl(48_100%_50%/0.3)]"
            >
              <s.icon size={18} strokeWidth={1.5} />
            </a>
          ))}
        </div>

        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} AIensen. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
