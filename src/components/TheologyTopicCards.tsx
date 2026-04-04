import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import HighlightMatch from "@/components/HighlightMatch";

interface TopicInfo {
  name: string;
  slug: string;
  accentHsl: string;
  icon: string;
  description: string;
}

const topics: TopicInfo[] = [
  {
    name: "Depravação Total",
    slug: "depravacao-total",
    accentHsl: "0 75% 55%",
    icon: "💔",
    description: "A condição espiritual do homem após a queda",
  },
  {
    name: "Eleição Incondicional",
    slug: "eleicao-incondicional",
    accentHsl: "45 100% 50%",
    icon: "👑",
    description: "A escolha soberana de Deus antes da fundação do mundo",
  },
  {
    name: "Expiação Limitada",
    slug: "expiacao-limitada",
    accentHsl: "350 80% 58%",
    icon: "✝️",
    description: "O alcance e eficácia da obra redentora de Cristo",
  },
  {
    name: "Graça Irresistível",
    slug: "graca-irresistivel",
    accentHsl: "270 80% 60%",
    icon: "🕊️",
    description: "O chamado eficaz do Espírito Santo ao eleito",
  },
  {
    name: "Perseverança dos Santos",
    slug: "perseveranca-dos-santos",
    accentHsl: "140 70% 50%",
    icon: "🛡️",
    description: "A segurança eterna dos verdadeiros crentes",
  },
  {
    name: "Dia do Senhor",
    slug: "dia-do-senhor",
    accentHsl: "210 90% 55%",
    icon: "☀️",
    description: "O significado e a observância do dia de descanso",
  },
  {
    name: "Soberania de Deus x Responsabilidade Humana",
    slug: "soberania-responsabilidade",
    accentHsl: "30 90% 55%",
    icon: "⚖️",
    description: "A harmonia entre o decreto divino e a ação humana",
  },
  {
    name: "Atributos de Deus",
    slug: "atributos-de-deus",
    accentHsl: "50 95% 55%",
    icon: "✨",
    description: "As perfeições comunicáveis e incomunicáveis de Deus",
  },
  {
    name: "Predestinação",
    slug: "predestinacao",
    accentHsl: "280 75% 55%",
    icon: "📜",
    description: "O decreto eterno de Deus sobre o destino das almas",
  },
  {
    name: "Teologia Sistemática",
    slug: "teologia-sistematica",
    accentHsl: "200 85% 55%",
    icon: "📚",
    description: "Estudo organizado e abrangente das doutrinas da fé cristã",
  },
];

interface Props {
  categoryId: string;
  searchQuery?: string;
}

const TheologyTopicCards = ({ categoryId, searchQuery = "" }: Props) => {
  const navigate = useNavigate();
  const query = searchQuery.toLowerCase().trim();
  const filteredTopics = query
    ? topics.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    : topics;

  if (filteredTopics.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground backdrop-blur-sm">
        Nenhum tópico encontrado para "{searchQuery}".
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredTopics.map((topic, i) => (
        <motion.div
          key={topic.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: [0.2, 0, 0, 1] }}
          onClick={() => navigate(`/categoria/${categoryId}/topico/${topic.slug}`)}
          className="group relative rounded-xl overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(145deg, hsl(${topic.accentHsl} / 0.08) 0%, hsl(var(--card)) 60%)`,
            border: `1px solid hsl(${topic.accentHsl} / 0.2)`,
          }}
        >
          {/* Top accent glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, hsl(${topic.accentHsl}), transparent)` }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: `hsl(${topic.accentHsl})` }}
          />

          <div className="relative p-5 flex items-start gap-4">
            {/* Icon with glow ring */}
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-lg text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{
                background: `hsl(${topic.accentHsl} / 0.12)`,
                border: `1px solid hsl(${topic.accentHsl} / 0.25)`,
              }}
            >
              <span className="relative z-10">{topic.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-display text-sm font-bold tracking-wide mb-1 transition-all duration-300"
                style={{ color: `hsl(${topic.accentHsl})` }}
              >
                <HighlightMatch text={topic.name} query={query} />
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                <HighlightMatch text={topic.description} query={query} />
              </p>
            </div>

            <BookOpen
              size={14}
              className="text-muted-foreground/30 mt-1 flex-shrink-0 group-hover:text-muted-foreground/60 transition-colors duration-300"
            />
          </div>

          {/* Bottom accent bar on hover */}
          <div
            className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
            style={{ background: `linear-gradient(90deg, hsl(${topic.accentHsl}), hsl(${topic.accentHsl} / 0.3))` }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export { topics };
export default TheologyTopicCards;
