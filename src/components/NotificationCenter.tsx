import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, Undo2, ExternalLink, Inbox } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface Props {
  onNavigate?: () => void;
  className?: string;
}

const NotificationCenter = ({ onNavigate, className }: Props) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"todas" | "nao-lidas">("todas");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead, remove } =
    useNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const list = filter === "nao-lidas" ? notifications.filter((n) => !n.read_at) : notifications;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Central de notificações"
        className="relative inline-flex items-center gap-1.5 font-alt text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-[min(92vw,380px)] max-h-[70vh] overflow-hidden rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-display text-sm font-bold tracking-wide text-foreground">
                Notificações
              </span>
              <button
                onClick={() => markAllAsRead.mutate()}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors"
              >
                <CheckCheck size={12} /> Marcar todas
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 px-4 py-2 border-b border-border/60">
              {(["todas", "nao-lidas"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-mono text-[10px] uppercase tracking-widest border transition-colors",
                    filter === f
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f === "todas" ? "Todas" : `Não lidas (${unreadCount})`}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="overflow-y-auto">
              {list.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-muted-foreground">
                  <Inbox size={22} className="opacity-60" />
                  <span className="font-body text-xs">
                    {filter === "nao-lidas"
                      ? "Nenhuma notificação não lida."
                      : "Nenhuma notificação por aqui ainda."}
                  </span>
                </div>
              ) : (
                list.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "group relative px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors",
                      n.read_at ? "bg-transparent" : "bg-primary/[0.06]"
                    )}
                  >
                    {!n.read_at && (
                      <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-xs font-bold text-foreground truncate">
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="font-body text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                            {n.body}
                          </p>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {formatDate(n.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {n.link && (
                        <button
                          onClick={() => {
                            if (!n.read_at) markAsRead.mutate(n.id);
                            setOpen(false);
                            onNavigate?.();
                            navigate(n.link!);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-primary/40 bg-primary/10 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-colors"
                        >
                          <ExternalLink size={11} /> Reabrir
                        </button>
                      )}
                      <button
                        onClick={() =>
                          n.read_at ? markAsUnread.mutate(n.id) : markAsRead.mutate(n.id)
                        }
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {n.read_at ? (
                          <>
                            <Undo2 size={11} /> Não lida
                          </>
                        ) : (
                          <>
                            <Check size={11} /> Lida
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => remove.mutate(n.id)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={11} /> Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
