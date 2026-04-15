import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";
import ChatGPTIcon from "./icons/ChatGPTIcon";
import ClaudeIcon from "./icons/ClaudeIcon";
import GeminiIcon from "./icons/GeminiIcon";
import PerplexityIcon from "./icons/PerplexityIcon";
import LovableIcon from "./icons/LovableIcon";
import GitHubIcon from "./icons/GitHubIcon";
import CursorIcon from "./icons/CursorIcon";
import ReplitIcon from "./icons/ReplitIcon";
import BoltIcon from "./icons/BoltIcon";
import V0Icon from "./icons/V0Icon";
import MidjourneyIcon from "./icons/MidjourneyIcon";
import RunwayIcon from "./icons/RunwayIcon";
import WindSurfIcon from "./icons/WindSurfIcon";
import DeepSeekIcon from "./icons/DeepSeekIcon";

interface AITool {
  name: string;
  slug: string;
  url: string;
  accentHsl: string;
  icon: ReactNode;
  description: string;
}

const textTools: AITool[] = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    url: "https://chat.openai.com",
    accentHsl: "160 80% 50%",
    icon: <ChatGPTIcon className="w-6 h-6" />,
    description: "Assistente de IA conversacional da OpenAI para geração de texto, código e mais",
  },
  {
    name: "Claude",
    slug: "claude",
    url: "https://claude.ai",
    accentHsl: "25 90% 55%",
    icon: <ClaudeIcon className="w-6 h-6" />,
    description: "IA avançada da Anthropic para análise, escrita e raciocínio complexo",
  },
  {
    name: "Gemini",
    slug: "gemini",
    url: "https://gemini.google.com",
    accentHsl: "210 90% 55%",
    icon: <GeminiIcon className="w-6 h-6" />,
    description: "Modelo multimodal do Google para texto, imagem e código",
  },
  {
    name: "Perplexity.AI",
    slug: "perplexity",
    url: "https://www.perplexity.ai",
    accentHsl: "190 85% 50%",
    icon: <PerplexityIcon className="w-6 h-6" />,
    description: "Motor de busca com IA para pesquisas precisas e referenciadas",
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    url: "https://www.deepseek.com",
    accentHsl: "250 70% 60%",
    icon: <DeepSeekIcon className="w-6 h-6" />,
    description: "Modelo de IA avançado para raciocínio, código e análise complexa",
  },
];

const programmingTools: AITool[] = [
  {
    name: "Lovable",
    slug: "lovable",
    url: "https://lovable.dev",
    accentHsl: "330 85% 60%",
    icon: <LovableIcon className="w-6 h-6" />,
    description: "Plataforma de desenvolvimento com IA para criar aplicações web completas",
  },
  {
    name: "GitHub",
    slug: "github",
    url: "https://github.com",
    accentHsl: "240 10% 60%",
    icon: <GitHubIcon className="w-6 h-6" />,
    description: "Plataforma de hospedagem de código e colaboração para desenvolvedores",
  },
  {
    name: "Cursor",
    slug: "cursor",
    url: "https://cursor.sh",
    accentHsl: "270 80% 60%",
    icon: <CursorIcon className="w-6 h-6" />,
    description: "Editor de código com IA integrada para desenvolvimento rápido e inteligente",
  },
  {
    name: "Replit",
    slug: "replit",
    url: "https://replit.com",
    accentHsl: "15 85% 55%",
    icon: <ReplitIcon className="w-6 h-6" />,
    description: "Ambiente de desenvolvimento online com IA para codificar, colaborar e implantar",
  },
  {
    name: "Bolt.new",
    slug: "bolt",
    url: "https://bolt.new",
    accentHsl: "45 95% 55%",
    icon: <BoltIcon className="w-6 h-6" />,
    description: "Plataforma de IA para criar e implantar aplicações web instantaneamente",
  },
  {
    name: "V0",
    slug: "v0",
    url: "https://v0.dev",
    accentHsl: "0 0% 85%",
    icon: <V0Icon className="w-6 h-6" />,
    description: "Ferramenta da Vercel com IA para gerar interfaces e componentes UI rapidamente",
  },
  {
    name: "WindSurf",
    slug: "windsurf",
    url: "https://codeium.com/windsurf",
    accentHsl: "200 85% 55%",
    icon: <WindSurfIcon className="w-6 h-6" />,
    description: "Editor de código com IA da Codeium para fluxos de desenvolvimento assistido",
  },
];

const mediaTools: AITool[] = [
  {
    name: "Midjourney",
    slug: "midjourney",
    url: "https://www.midjourney.com",
    accentHsl: "220 70% 55%",
    icon: <MidjourneyIcon className="w-6 h-6" />,
    description: "IA generativa especializada na criação de imagens artísticas de alta qualidade",
  },
  {
    name: "Runway",
    slug: "runway",
    url: "https://runwayml.com",
    accentHsl: "165 75% 50%",
    icon: <RunwayIcon className="w-6 h-6" />,
    description: "Plataforma de IA para geração e edição de vídeos com modelos generativos",
  },
];

const tools = [...textTools, ...programmingTools, ...mediaTools];

interface Props {
  categoryId: string;
  searchQuery?: string;
}

const AIToolCards = ({ categoryId, searchQuery = "" }: Props) => {
  const query = searchQuery.toLowerCase().trim();
  const filtered = query
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    : tools;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground backdrop-blur-sm">
        Nenhuma ferramenta encontrada para "{searchQuery}".
      </div>
    );
  }

  const filterTools = (toolList: AITool[]) => {
    if (!query) return toolList;
    return toolList.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  };

  const filteredText = filterTools(textTools);
  const filteredProgramming = filterTools(programmingTools);
  const filteredMedia = filterTools(mediaTools);

  const hasResults = filteredText.length > 0 || filteredProgramming.length > 0 || filteredMedia.length > 0;

  if (!hasResults) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground backdrop-blur-sm">
        Nenhuma ferramenta encontrada para "{searchQuery}".
      </div>
    );
  }

  const renderToolCard = (tool: AITool, i: number) => (
    <motion.a
      key={tool.slug}
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: [0.2, 0, 0, 1] }}
      className="group relative rounded-xl overflow-hidden cursor-pointer no-underline"
      style={{
        background: `linear-gradient(145deg, hsl(${tool.accentHsl} / 0.08) 0%, hsl(var(--card)) 60%)`,
        border: `1px solid hsl(${tool.accentHsl} / 0.2)`,
      }}
    >
      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, hsl(${tool.accentHsl}), transparent)` }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: `hsl(${tool.accentHsl})` }}
      />

      <div className="relative p-5 flex items-start gap-4">
        {/* Icon with glow ring */}
        <div
          className="relative flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `hsl(${tool.accentHsl} / 0.12)`,
            border: `1px solid hsl(${tool.accentHsl} / 0.25)`,
            color: `hsl(${tool.accentHsl})`,
          }}
        >
          <span className="relative z-10">{tool.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-display text-sm font-bold tracking-wide mb-1 transition-all duration-300"
            style={{ color: `hsl(${tool.accentHsl})` }}
          >
            {tool.name}
          </h3>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </div>

        <ExternalLink
          size={14}
          className="text-muted-foreground/30 mt-1 flex-shrink-0 group-hover:text-muted-foreground/60 transition-colors duration-300"
        />
      </div>

      {/* Bottom accent bar on hover */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ background: `linear-gradient(90deg, hsl(${tool.accentHsl}), hsl(${tool.accentHsl} / 0.3))` }}
      />
    </motion.a>
  );

  const CategorySeparator = ({ title, accentColor }: { title: string; accentColor: string }) => (
    <div className="flex items-center gap-4 my-8 first:mt-0">
      <div className="relative">
        <h3
          className="font-display text-lg font-bold tracking-wide px-4 py-2 rounded-lg relative z-10"
          style={{
            color: `hsl(${accentColor})`,
            background: `linear-gradient(135deg, hsl(${accentColor} / 0.15), hsl(${accentColor} / 0.05))`,
            border: `1px solid hsl(${accentColor} / 0.3)`,
          }}
        >
          {title}
        </h3>
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(90deg, hsl(${accentColor} / 0.4), transparent)`,
        }}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {filteredText.length > 0 && (
        <>
          <CategorySeparator title="IAs de Texto" accentColor="190 85% 50%" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredText.map((tool, i) => renderToolCard(tool, i))}
          </div>
        </>
      )}

      {filteredProgramming.length > 0 && (
        <>
          <CategorySeparator title="Ferramentas de Programação" accentColor="270 80% 60%" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProgramming.map((tool, i) => renderToolCard(tool, i))}
          </div>
        </>
      )}

      {filteredMedia.length > 0 && (
        <>
          <CategorySeparator title="Imagem & Vídeo" accentColor="165 75% 50%" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedia.map((tool, i) => renderToolCard(tool, i))}
          </div>
        </>
      )}
    </div>
  );
};

export { tools };
export default AIToolCards;
