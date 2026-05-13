import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FolderOpen, ChevronRight, Folder } from "lucide-react";

interface FolderItem {
  name: string;
  slug: string;
  code: string;
  accentHsl: string;
  description: string;
}

interface Props {
  items: FolderItem[];
  onOpen: (slug: string) => void;
  variant?: "folder" | "subfolder";
  heading?: string;
}

const FolderCards = ({ items, onOpen, variant = "folder", heading }: Props) => {
  const navigate = useNavigate();
  void navigate;
  const Icon = variant === "folder" ? FolderOpen : Folder;

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      {heading && (
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70">
            &gt; {heading}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70">
            {items.length.toString().padStart(2, "0")} {variant === "folder" ? "PASTAS" : "SUB-PASTAS"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((f, i) => (
          <motion.button
            key={f.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] }}
            onClick={() => onOpen(f.slug)}
            className="group relative text-left rounded-xl overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(160deg, hsl(${f.accentHsl} / 0.12) 0%, hsl(var(--card)) 55%, hsl(var(--card)) 100%)`,
              border: `1px solid hsl(${f.accentHsl} / 0.3)`,
            }}
          >
            {/* Top scanline */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(${f.accentHsl}), transparent)`,
              }}
            />
            {/* Animated sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 h-px opacity-50 group-hover:opacity-90"
              style={{ background: `hsl(${f.accentHsl})` }}
              initial={{ y: 0 }}
              animate={{ y: [0, 200, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
            />
            {/* Grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-500"
              style={{
                backgroundImage: `linear-gradient(hsl(${f.accentHsl} / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(${f.accentHsl} / 0.6) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            {/* Corner glow */}
            <div
              className="absolute -top-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-25 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: `hsl(${f.accentHsl})` }}
            />
            {/* Corner brackets */}
            {(["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"] as const).map((c) => (
              <span
                key={c}
                aria-hidden
                className={`absolute ${c} w-3 h-3 opacity-70`}
                style={{ borderColor: `hsl(${f.accentHsl})` }}
              />
            ))}

            <div className="relative p-5 flex flex-col gap-4 min-h-[200px]">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: `hsl(${f.accentHsl})` }}
                >
                  {f.code}
                </span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: `hsl(${f.accentHsl})`,
                    boxShadow: `0 0 8px hsl(${f.accentHsl})`,
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="relative w-12 h-12 rounded-md flex items-center justify-center"
                  style={{
                    background: `hsl(${f.accentHsl} / 0.12)`,
                    border: `1px solid hsl(${f.accentHsl} / 0.4)`,
                    boxShadow: `0 0 18px hsl(${f.accentHsl} / 0.3)`,
                  }}
                >
                  <Icon size={22} style={{ color: `hsl(${f.accentHsl})` }} />
                </div>
                <span
                  className="font-mono text-[10px] tracking-[0.18em] uppercase"
                  style={{ color: `hsl(${f.accentHsl} / 0.85)` }}
                >
                  {variant === "folder" ? "DIR //" : "SUBDIR //"}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground leading-tight mb-1.5">
                  {f.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div
                className="flex items-center justify-between pt-2 border-t border-dashed"
                style={{ borderColor: `hsl(${f.accentHsl} / 0.3)` }}
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/70">
                  &gt; open_dir
                </span>
                <span
                  className="flex items-center gap-1 text-[11px] font-display tracking-wider uppercase transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: `hsl(${f.accentHsl})` }}
                >
                  Acessar <ChevronRight size={12} />
                </span>
              </div>
            </div>

            <div
              className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
              style={{
                background: `linear-gradient(90deg, hsl(${f.accentHsl}), hsl(${f.accentHsl} / 0.2))`,
              }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FolderCards;
