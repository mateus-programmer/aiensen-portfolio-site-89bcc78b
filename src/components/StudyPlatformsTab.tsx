import { motion } from "framer-motion";
import { GraduationCap, ChevronRight, Sparkles, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const accentHsl = "55 100% 55%"; // neon yellow to match category

const StudyPlatformsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mb-10"
    >
      <h2 className="font-display text-lg font-bold text-foreground mb-5">
        Recursos complementares
      </h2>

      <Tabs defaultValue="plataformas" className="w-full">
        <TabsList
          className="relative h-auto bg-transparent p-0 gap-2 border-b border-dashed rounded-none w-full justify-start"
          style={{ borderColor: `hsl(${accentHsl} / 0.25)` }}
        >
          <TabsTrigger
            value="plataformas"
            className="group relative px-4 py-2.5 rounded-t-md rounded-b-none bg-card/40 backdrop-blur-sm border border-b-0 data-[state=active]:bg-card data-[state=active]:shadow-none font-display text-xs tracking-[0.18em] uppercase transition-all"
            style={{
              borderColor: `hsl(${accentHsl} / 0.3)`,
              color: `hsl(${accentHsl})`,
            }}
          >
            <span className="flex items-center gap-2">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `hsl(${accentHsl})` }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <Layers size={13} />
              Recursos
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-px h-[2px] opacity-0 group-data-[state=active]:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(${accentHsl}), transparent)`,
                boxShadow: `0 0 12px hsl(${accentHsl} / 0.6)`,
              }}
            />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plataformas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(160deg, hsl(${accentHsl} / 0.10) 0%, hsl(var(--card)) 55%, hsl(var(--card)) 100%)`,
                border: `1px solid hsl(${accentHsl} / 0.25)`,
              }}
            >
              {/* Top scanline */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(${accentHsl}), transparent)`,
                }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80"
                style={{ background: `hsl(${accentHsl})` }}
                initial={{ y: 0 }}
                animate={{ y: [0, 220, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(hsl(${accentHsl} / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(${accentHsl} / 0.6) 1px, transparent 1px)`,
                  backgroundSize: "22px 22px",
                }}
              />

              {/* Corner glow */}
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: `hsl(${accentHsl})` }}
              />

              {/* Corner brackets */}
              <span aria-hidden className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-70" style={{ borderColor: `hsl(${accentHsl})` }} />
              <span aria-hidden className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-70" style={{ borderColor: `hsl(${accentHsl})` }} />
              <span aria-hidden className="absolute bottom-2 left-2 w-3 h-3 border-b border-l opacity-70" style={{ borderColor: `hsl(${accentHsl})` }} />
              <span aria-hidden className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-70" style={{ borderColor: `hsl(${accentHsl})` }} />

              <div className="relative p-5 flex flex-col gap-4 min-h-[210px]">
                <div className="flex items-center justify-between text-[10px] font-display tracking-[0.18em] uppercase">
                  <span className="font-mono" style={{ color: `hsl(${accentHsl})` }}>
                    PLT-001
                  </span>
                  <span
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border"
                    style={{
                      borderColor: `hsl(${accentHsl} / 0.4)`,
                      background: `hsl(${accentHsl} / 0.08)`,
                      color: `hsl(${accentHsl})`,
                    }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: `hsl(${accentHsl})` }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    ONLINE
                  </span>
                </div>

                <div className="flex items-end gap-3">
                  <div
                    className="font-display font-black text-3xl leading-none tracking-tight"
                    style={{
                      color: `hsl(${accentHsl})`,
                      textShadow: `0 0 20px hsl(${accentHsl} / 0.45)`,
                    }}
                  >
                    HUB
                  </div>
                  <GraduationCap size={20} className="mb-0.5 opacity-70" style={{ color: `hsl(${accentHsl})` }} />
                  <Sparkles size={14} className="mb-1 opacity-50" style={{ color: `hsl(${accentHsl})` }} />
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-foreground mb-1.5">
                    Plataformas de estudos
                  </h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    Conjunto curado de plataformas para estudar programação — cursos, trilhas e laboratórios práticos.
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-dashed" style={{ borderColor: `hsl(${accentHsl} / 0.25)` }}>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/70">
                    &gt; em_breve
                  </span>
                  <span
                    className="flex items-center gap-1 text-[11px] font-display tracking-wider uppercase transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: `hsl(${accentHsl})` }}
                  >
                    Explorar <ChevronRight size={12} />
                  </span>
                </div>
              </div>

              <div
                className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{
                  background: `linear-gradient(90deg, hsl(${accentHsl}), hsl(${accentHsl} / 0.2))`,
                }}
              />
            </motion.a>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default StudyPlatformsTab;
