import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PdfFileItemProps {
  id: string;
  title: string;
  fileUrl: string;
  neonColor: string;
  index: number;
  isAdmin: boolean;
  onDeleted: () => void;
}

const accentBorder: Record<string, string> = {
  yellow: "border-l-neon-yellow",
  cyan: "border-l-neon-cyan",
  purple: "border-l-neon-purple",
};

const extractStoragePath = (fileUrl: string): string | null => {
  const parts = fileUrl.split("/category-files/");
  return parts[1] ? decodeURIComponent(parts[1]) : null;
};

const PdfFileItem = ({ id, title, fileUrl, neonColor, index, isAdmin, onDeleted }: PdfFileItemProps) => {
  const [showViewer, setShowViewer] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const storagePath = extractStoragePath(fileUrl);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!storagePath) return;
      const { data, error } = await supabase.storage
        .from("category-files")
        .createSignedUrl(storagePath, 60 * 60);
      if (!cancelled && !error && data?.signedUrl) {
        setSignedUrl(data.signedUrl);
      }
    };
    load();
    const interval = setInterval(load, 50 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [storagePath]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Excluir "${title}"?`)) return;

    if (storagePath) {
      await supabase.storage.from("category-files").remove([storagePath]);
    }

    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir arquivo.");
      return;
    }

    toast.success("Arquivo excluído.");
    onDeleted();
  };

  const activeUrl = signedUrl ?? fileUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-card border border-border rounded-xl overflow-hidden border-l-4 ${accentBorder[neonColor] || accentBorder.yellow} hover:bg-secondary/30 transition-colors`}
    >
      <div className="flex items-center gap-4 p-5">
        <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
          <FileText size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold text-foreground truncate">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">PDF</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowViewer(!showViewer)}
            className={`p-2 transition-colors rounded-lg hover:bg-secondary ${showViewer ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title={showViewer ? "Fechar visualizador" : "Visualizar"}
          >
            {showViewer ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            title="Abrir em nova aba"
          >
            <ExternalLink size={16} />
          </a>
          <a
            href={activeUrl}
            download
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            title="Baixar"
          >
            <Download size={16} />
          </a>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showViewer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "70vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border"
          >
            <iframe
              src={`${activeUrl}#toolbar=1&navpanes=1`}
              className="w-full h-full"
              title={title}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PdfFileItem;
