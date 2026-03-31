import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfUploadProps {
  categoryId: string;
  onUploadComplete: () => void;
}

const PdfUpload = ({ categoryId, onUploadComplete }: PdfUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (file.type !== "application/pdf") {
          toast.error(`"${file.name}" não é um PDF.`);
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          toast.error(`"${file.name}" excede 20MB.`);
          continue;
        }

        const filePath = `${categoryId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("category-files")
          .upload(filePath, file, { contentType: "application/pdf" });

        if (uploadError) {
          toast.error(`Erro ao enviar "${file.name}": ${uploadError.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("category-files")
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from("content_items")
          .insert({
            category_id: categoryId,
            title: file.name.replace(/\.pdf$/i, ""),
            file_url: urlData.publicUrl,
            is_active: true,
          });

        if (insertError) {
          toast.error(`Erro ao salvar "${file.name}": ${insertError.message}`);
          continue;
        }

        toast.success(`"${file.name}" enviado com sucesso!`);
      }

      onUploadComplete();
    } catch (err) {
      toast.error("Erro inesperado ao enviar arquivo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6">
      <label
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary font-display text-sm font-semibold cursor-pointer hover:bg-primary/10 transition-colors ${
          uploading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {uploading ? "Enviando..." : "Enviar PDF(s)"}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default PdfUpload;
