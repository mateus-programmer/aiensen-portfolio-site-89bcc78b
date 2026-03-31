import { motion } from "framer-motion";
import { FileText, Download, Trash2, ExternalLink } from "lucide-react";
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

const PdfFileItem = ({ id, title, fileUrl, neonColor, index, isAdmin, onDeleted }: PdfFileItemProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Excluir "${title}"?`)) return;

    // Extract storage path from URL
    const urlParts = fileUrl.split("/category-files/");
    const storagePath = urlParts[1] ? decodeURIComponent(urlParts[1]) : null;

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-card border border-border rounded-xl p-5 border-l-4 ${accentBorder[neonColor] || accentBorder.yellow} hover:bg-secondary/30 transition-colors`}
    >
      <div className="flex items-center gap-4">
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
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            title="Abrir em nova aba"
          >
            <ExternalLink size={16} />
          </a>
          <a
            href={fileUrl}
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
    </motion.div>
  );
};

export default PdfFileItem;
