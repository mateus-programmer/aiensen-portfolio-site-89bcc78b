import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Cpu, ChevronRight } from "lucide-react";
import HighlightMatch from "@/components/HighlightMatch";

export interface SemesterInfo {
  name: string;
  slug: string;
  code: string;
  period: string;
  status: "concluido" | "em-andamento" | "agendado";
  accentHsl: string;
  description: string;
  tag: string;
  totalSubjects: number;
  completedSubjects: number;
}

export const semesters: SemesterInfo[] = [
  {
    name: "Primeiro Semestre 2025",
    slug: "1s-2025",
    code: "ENG-S01.2025",
    period: "01/2025",
    status: "concluido",
    accentHsl: "180 95% 55%",
    description: "Fundamentos, lógica e introdução à engenharia de software.",
    tag: "Primeiro Semestre 2025",
    totalSubjects: 5,
    completedSubjects: 5,
  },
  {
    name: "Segundo Semestre 2025",
    slug: "2s-2025",
    code: "ENG-S02.2025",
    period: "02/2025",
    status: "concluido",
    accentHsl: "55 100% 55%",
    description: "Estruturas de dados, paradigmas e modelagem de sistemas.",
    tag: "Segundo Semestre 2025",
    totalSubjects: 6,
    completedSubjects: 6,
  },
  {
    name: "Primeiro Semestre 2026",
    slug: "1s-2026",
    code: "ENG-S03.2026",
    period: "01/2026",
    status: "em-andamento",
    accentHsl: "280 90% 65%",
    description: "Arquitetura, testes, DevOps e práticas avançadas.",
    tag: "Primeiro Semestre 2026",
    totalSubjects: 6,
    completedSubjects: 2,
  },
  {
    name: "Segundo Semestre 2026",
    slug: "2s-2026",
    code: "ENG-S04.2026",
    period: "02/2026",
    status: "agendado",
    accentHsl: "320 90% 60%",
    description: "Projeto integrador, segurança e tópicos avançados.",
    tag: "Segundo Semestre 2026",
    totalSubjects: 6,
    completedSubjects: 0,
  },
];

const statusLabel: Record<SemesterInfo["status"], string> = {
  concluido: "CONCLUÍDO",
  "em-andamento": "EM ANDAMENTO",
  agendado: "AGENDADO",
};

interface Props {
  categoryId: string;
  searchQuery?: string;
}

const SemesterCards = ({ categoryId, searchQuery = "" }: Props) => {
  const navigate = useNavigate();
  const query = searchQuery.toLowerCase().trim();
  const filtered = query
    ? semesters.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.code.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    : semesters;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground backdrop-blur-sm">
        Nenhum semestre encontrado para "{searchQuery}".
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {filtered.map((s, i) => (
        <motion.div
          key={s.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] }}
          onClick={() =>
            navigate(`/categoria/${categoryId}/semestre/${s.slug}`)
          }
          className="group relative rounded-xl overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(160deg, hsl(${s.accentHsl} / 0.10) 0%, hsl(var(--card)) 55%, hsl(var(--card)) 100%)`,
            border: `1px solid hsl(${s.accentHsl} / 0.25)`,
          }}
        >
          {/* Animated scanline */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-70"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(${s.accentHsl}), transparent)`,
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80"
            style={{ background: `hsl(${s.accentHsl})` }}
            initial={{ y: 0 }}
            animate={{ y: [0, 220, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
          />

          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
            style={{
              backgroundImage: `linear-gradient(hsl(${s.accentHsl} / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(${s.accentHsl} / 0.6) 1px, transparent 1px)`,
              backgroundSize: "22px 22px",
            }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"
            style={{ background: `hsl(${s.accentHsl})` }}
          />

          {/* Corner brackets */}
          <span
            aria-hidden
            className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-70"
            style={{ borderColor: `hsl(${s.accentHsl})` }}
          />
          <span
            aria-hidden
            className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-70"
            style={{ borderColor: `hsl(${s.accentHsl})` }}
          />
          <span
            aria-hidden
            className="absolute bottom-2 left-2 w-3 h-3 border-b border-l opacity-70"
            style={{ borderColor: `hsl(${s.accentHsl})` }}
          />
          <span
            aria-hidden
            className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-70"
            style={{ borderColor: `hsl(${s.accentHsl})` }}
          />

          <div className="relative p-5 flex flex-col gap-4 min-h-[210px]">
            {/* Header: code + status */}
            <div className="flex items-center justify-between text-[10px] font-display tracking-[0.18em] uppercase">
              <span
                className="font-mono"
                style={{ color: `hsl(${s.accentHsl})` }}
              >
                {s.code}
              </span>
              <span
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border"
                style={{
                  borderColor: `hsl(${s.accentHsl} / 0.4)`,
                  background: `hsl(${s.accentHsl} / 0.08)`,
                  color: `hsl(${s.accentHsl})`,
                }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: `hsl(${s.accentHsl})` }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                {statusLabel[s.status]}
              </span>
            </div>

            {/* Period mega display */}
            <div className="flex items-end gap-3">
              <div
                className="font-display font-black text-4xl leading-none tracking-tight"
                style={{
                  color: `hsl(${s.accentHsl})`,
                  textShadow: `0 0 20px hsl(${s.accentHsl} / 0.45)`,
                }}
              >
                {s.period}
              </div>
              <Cpu
                size={18}
                className="mb-1 opacity-60"
                style={{ color: `hsl(${s.accentHsl})` }}
              />
            </div>

            {/* Title */}
            <div>
              <h3 className="font-display text-base font-bold text-foreground mb-1.5">
                <HighlightMatch text={s.name} query={query} />
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                <HighlightMatch text={s.description} query={query} />
              </p>
            </div>

            {/* Progress bar */}
            {(() => {
              const pct = s.totalSubjects
                ? Math.round((s.completedSubjects / s.totalSubjects) * 100)
                : 0;
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="text-muted-foreground/70">Progresso</span>
                    <span style={{ color: `hsl(${s.accentHsl})` }}>
                      {s.completedSubjects}/{s.totalSubjects} · {pct}%
                    </span>
                  </div>
                  <div
                    className="relative h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: `hsl(${s.accentHsl} / 0.12)` }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(${s.accentHsl} / 0.7), hsl(${s.accentHsl}))`,
                        boxShadow: `0 0 12px hsl(${s.accentHsl} / 0.7)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.2 + i * 0.08,
                        ease: [0.2, 0, 0, 1],
                      }}
                    />
                    {pct > 0 && pct < 100 && (
                      <motion.div
                        className="absolute inset-y-0 w-8 pointer-events-none"
                        style={{
                          background: `linear-gradient(90deg, transparent, hsl(${s.accentHsl} / 0.6), transparent)`,
                        }}
                        animate={{ x: ["-32px", "100%"] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 1.2,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Footer CTA bar */}
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-dashed" style={{ borderColor: `hsl(${s.accentHsl} / 0.25)` }}>
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/70">
                &gt; access_logs
              </span>
              <span
                className="flex items-center gap-1 text-[11px] font-display tracking-wider uppercase transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: `hsl(${s.accentHsl})` }}
              >
                Abrir <ChevronRight size={12} />
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
        </motion.div>
      ))}
    </div>
  );
};

export default SemesterCards;
