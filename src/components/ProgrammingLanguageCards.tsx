import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";
import HighlightMatch from "@/components/HighlightMatch";

interface LanguageInfo {
  name: string;
  slug: string;
  accentHsl: string;
  icon: string;
  description: string;
}

const languages: LanguageInfo[] = [
  {
    name: "HTML",
    slug: "html",
    accentHsl: "15 90% 55%",
    icon: "🌐",
    description: "Estrutura e marcação web",
  },
  {
    name: "CSS",
    slug: "css",
    accentHsl: "210 90% 55%",
    icon: "🎨",
    description: "Estilização e layout",
  },
  {
    name: "Python",
    slug: "python",
    accentHsl: "48 100% 50%",
    icon: "🐍",
    description: "Ciência de dados e automação",
  },
  {
    name: "JavaScript",
    slug: "javascript",
    accentHsl: "50 95% 55%",
    icon: "⚡",
    description: "Web interativa e full-stack",
  },
  {
    name: "Java",
    slug: "java",
    accentHsl: "0 75% 55%",
    icon: "☕",
    description: "Aplicações enterprise",
  },
  {
    name: "Lisp",
    slug: "lisp",
    accentHsl: "140 70% 50%",
    icon: "🧠",
    description: "Programação funcional e IA clássica",
  },
  {
    name: "R",
    slug: "r",
    accentHsl: "200 85% 55%",
    icon: "📊",
    description: "Estatística e análise de dados",
  },
  {
    name: "Julia",
    slug: "julia",
    accentHsl: "270 80% 60%",
    icon: "🔬",
    description: "Computação científica de alto desempenho",
  },
  {
    name: "Scala",
    slug: "scala",
    accentHsl: "350 80% 58%",
    icon: "🔥",
    description: "Funcional + orientado a objetos na JVM",
  },
];

interface Props {
  categoryId: string;
  searchQuery?: string;
}

const ProgrammingLanguageCards = ({ categoryId, searchQuery = "" }: Props) => {
  const navigate = useNavigate();
  const query = searchQuery.toLowerCase().trim();
  const filteredLanguages = query
    ? languages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(query) ||
          lang.slug.toLowerCase().includes(query) ||
          lang.description.toLowerCase().includes(query)
      )
    : languages;

  if (filteredLanguages.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground backdrop-blur-sm">
        Nenhuma linguagem encontrada para "{searchQuery}".
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredLanguages.map((lang, i) => (
        <motion.div
          key={lang.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: [0.2, 0, 0, 1] }}
          onClick={() => navigate(`/categoria/${categoryId}/linguagem/${lang.slug}`)}
          className="group relative rounded-xl overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(145deg, hsl(${lang.accentHsl} / 0.08) 0%, hsl(var(--card)) 60%)`,
            border: `1px solid hsl(${lang.accentHsl} / 0.2)`,
          }}
        >
          {/* Top accent glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, hsl(${lang.accentHsl}), transparent)` }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: `hsl(${lang.accentHsl})` }}
          />

          <div className="relative p-5 flex items-start gap-4">
            {/* Icon with glow ring */}
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-lg text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{
                background: `hsl(${lang.accentHsl} / 0.12)`,
                border: `1px solid hsl(${lang.accentHsl} / 0.25)`,
                boxShadow: `0 0 0px hsl(${lang.accentHsl} / 0)`,
              }}
              onMouseEnter={() => {}}
            >
              <span className="relative z-10">{lang.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-display text-sm font-bold tracking-wide mb-1 transition-all duration-300"
                style={{ color: `hsl(${lang.accentHsl})` }}
              >
                {lang.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {lang.description}
              </p>
            </div>

            <Terminal
              size={14}
              className="text-muted-foreground/30 mt-1 flex-shrink-0 group-hover:text-muted-foreground/60 transition-colors duration-300"
            />
          </div>

          {/* Bottom accent bar on hover */}
          <div
            className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
            style={{ background: `linear-gradient(90deg, hsl(${lang.accentHsl}), hsl(${lang.accentHsl} / 0.3))` }}
          />

          {/* Hover glow border effect */}
          <style>{`
            .group:hover {
              box-shadow: 0 0 20px hsl(${lang.accentHsl} / 0.15), 0 8px 32px hsl(0 0% 0% / 0.4);
            }
          `}</style>
        </motion.div>
      ))}
    </div>
  );
};

export { languages };
export default ProgrammingLanguageCards;
