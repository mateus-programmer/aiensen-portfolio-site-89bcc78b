import { Github, Linkedin, Mail, Instagram, MessageCircle } from "lucide-react";

const FooterSection = () => {
  return (
    <footer id="contato" className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight mb-4">
          <span className="neon-text-yellow">AI</span>
          <span className="text-foreground">ensen</span>
        </h2>
        <p className="font-alt text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          All In One With AI — Minha biblioteca tecnológica futurista.
        </p>

        <div className="flex justify-center gap-6 mb-10">
          {[
            { icon: Mail, href: "https://mail.yahoo.com/d/compose/?to=mateusleitesilva@yahoo.com", label: "Email" },
            { icon: Instagram, href: "https://www.instagram.com/iensenmateus/", label: "Instagram" },
            { icon: Github, href: "https://github.com/mateus-programmer", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/mateusiensen/", label: "LinkedIn" },
            { icon: MessageCircle, href: "https://wa.me/5511948574529", label: "WhatsApp" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
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
