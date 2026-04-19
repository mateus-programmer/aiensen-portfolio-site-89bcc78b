import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sigma,
  GitBranch,
  Network,
  Cloud,
  ShieldCheck,
  Brain,
  ClipboardList,
  Cpu,
  Terminal,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export interface SubjectInfo {
  name: string;
  slug: string;
  code: string;
  accentHsl: string;
  icon: LucideIcon;
  shortLabel: string;
  description: string;
  tag: string;
}

export const subjectsBySemester: Record<string, SubjectInfo[]> = {
  "1s-2025": [
    {
      name: "Matemática e Lógica",
      slug: "matematica-logica",
      code: "MAT.01",
      accentHsl: "180 95% 55%",
      icon: Sigma,
      shortLabel: "MAT_LOG",
      description: "Raciocínio lógico, álgebra e fundamentos matemáticos.",
      tag: "Matemática e Lógica",
    },
    {
      name: "Processo de Desenvolvimento de Software",
      slug: "processo-desenvolvimento-software",
      code: "PDS.02",
      accentHsl: "55 100% 55%",
      icon: GitBranch,
      shortLabel: "DEV_PROC",
      description: "Metodologias ágeis, ciclo de vida e gestão de projetos.",
      tag: "Processo de Desenvolvimento de Software",
    },
    {
      name: "Fundamentos de Redes de Computadores",
      slug: "fundamentos-redes",
      code: "NET.03",
      accentHsl: "200 95% 60%",
      icon: Network,
      shortLabel: "NET_CORE",
      description: "Protocolos, arquitetura TCP/IP e topologias de rede.",
      tag: "Fundamentos de Redes de Computadores",
    },
    {
      name: "Computação em Nuvem",
      slug: "computacao-nuvem",
      code: "CLD.04",
      accentHsl: "280 90% 65%",
      icon: Cloud,
      shortLabel: "CLOUD",
      description: "IaaS, PaaS, SaaS e plataformas como AWS, Azure e GCP.",
      tag: "Computação em Nuvem",
    },
    {
      name: "Introdução à Segurança da Informação",
      slug: "intro-seguranca-informacao",
      code: "SEC.05",
      accentHsl: "0 90% 60%",
      icon: ShieldCheck,
      shortLabel: "SEC_INTRO",
      description: "Criptografia, ameaças, defesa e boas práticas.",
      tag: "Introdução à Segurança da Informação",
    },
  ],
  "2s-2025": [
    {
      name: "Pensamento Computacional",
      slug: "pensamento-computacional",
      code: "PC.01",
      accentHsl: "160 90% 55%",
      icon: Brain,
      shortLabel: "COMP_THINK",
      description: "Decomposição, abstração, algoritmos e resolução de problemas.",
      tag: "Pensamento Computacional",
    },
    {
      name: "Requisitos de Sistemas",
      slug: "requisitos-sistemas",
      code: "REQ.02",
      accentHsl: "35 95% 60%",
      icon: ClipboardList,
      shortLabel: "SYS_REQ",
      description: "Elicitação, análise e especificação de requisitos funcionais.",
      tag: "Requisitos de Sistemas",
    },
    {
      name: "Arquitetura de Computadores",
      slug: "arquitetura-computadores",
      code: "ARC.03",
      accentHsl: "220 90% 65%",
      icon: Cpu,
      shortLabel: "COMP_ARCH",
      description: "Organização de hardware, CPU, memória e sistemas de barramento.",
      tag: "Arquitetura de Computadores",
    },
    {
      name: "Introdução à Programação de Computadores",
      slug: "intro-programacao",
      code: "PROG.04",
      accentHsl: "140 85% 50%",
      icon: Terminal,
      shortLabel: "INTRO_PROG",
      description: "Lógica de programação, variáveis, estruturas e funções.",
      tag: "Introdução à Programação de Computadores",
    },
  ],
};

interface Props {
  categoryId: string;
  semesterSlug: string;
}

const SubjectCards = ({ categoryId, semesterSlug }: Props) => {
  const navigate = useNavigate();
  const subjects = subjectsBySemester[semesterSlug] || [];

  if (subjects.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70">
          &gt; subjects.matrix
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70">
          {subjects.length.toString().padStart(2, "0")} ATIVAS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {subjects.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.2, 0, 0, 1] }}
              onClick={() =>
                navigate(
                  `/categoria/${categoryId}/semestre/${semesterSlug}/materia/${s.slug}`
                )
              }
              className="group relative text-left rounded-lg overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(155deg, hsl(${s.accentHsl} / 0.10) 0%, hsl(var(--card)) 60%, hsl(var(--card)) 100%)`,
                border: `1px solid hsl(${s.accentHsl} / 0.28)`,
              }}
            >
              {/* Top scanline */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(${s.accentHsl}), transparent)`,
                }}
              />

              {/* Animated horizontal sweep line */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 h-px opacity-50 group-hover:opacity-90"
                style={{ background: `hsl(${s.accentHsl})` }}
                initial={{ y: 0 }}
                animate={{ y: [0, 180, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(hsl(${s.accentHsl} / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(${s.accentHsl} / 0.6) 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Corner glow */}
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-25 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: `hsl(${s.accentHsl})` }}
              />

              {/* Corner brackets */}
              <span
                aria-hidden
                className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l opacity-70"
                style={{ borderColor: `hsl(${s.accentHsl})` }}
              />
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r opacity-70"
                style={{ borderColor: `hsl(${s.accentHsl})` }}
              />
              <span
                aria-hidden
                className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l opacity-70"
                style={{ borderColor: `hsl(${s.accentHsl})` }}
              />
              <span
                aria-hidden
                className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r opacity-70"
                style={{ borderColor: `hsl(${s.accentHsl})` }}
              />

              <div className="relative p-4 flex flex-col gap-3 min-h-[180px]">
                {/* Header: code + status dot */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[9px] tracking-[0.2em] uppercase"
                    style={{ color: `hsl(${s.accentHsl})` }}
                  >
                    {s.code}
                  </span>
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: `hsl(${s.accentHsl})`,
                      boxShadow: `0 0 8px hsl(${s.accentHsl})`,
                    }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </div>

                {/* Icon + short label */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="relative w-10 h-10 rounded-md flex items-center justify-center"
                    style={{
                      background: `hsl(${s.accentHsl} / 0.1)`,
                      border: `1px solid hsl(${s.accentHsl} / 0.35)`,
                      boxShadow: `0 0 16px hsl(${s.accentHsl} / 0.25)`,
                    }}
                  >
                    <Icon size={18} style={{ color: `hsl(${s.accentHsl})` }} />
                  </div>
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: `hsl(${s.accentHsl} / 0.85)` }}
                  >
                    {s.shortLabel}
                  </span>
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-foreground leading-tight mb-1">
                    {s.name}
                  </h3>
                  <p className="font-body text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-dashed"
                  style={{ borderColor: `hsl(${s.accentHsl} / 0.25)` }}
                >
                  <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/70">
                    open
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-display tracking-wider uppercase transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: `hsl(${s.accentHsl})` }}
                  >
                    <ChevronRight size={11} />
                  </span>
                </div>
              </div>

              {/* Bottom expanding line */}
              <div
                className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{
                  background: `linear-gradient(90deg, hsl(${s.accentHsl}), hsl(${s.accentHsl} / 0.2))`,
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectCards;
