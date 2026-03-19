import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Category = Tables<"categories">;

interface CategoriesAdminProps {
  categories: Category[];
  onRefresh: () => void;
}

const inputClass = "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass = "block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider";

const CategoriesAdmin = ({ categories, onRefresh }: CategoriesAdminProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", image_url: "", neon_color: "yellow", tags: "", sort_order: 0, is_active: true,
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", image_url: "", neon_color: "yellow", tags: "", sort_order: 0, is_active: true });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      title: cat.title, description: cat.description || "", image_url: cat.image_url || "",
      neon_color: cat.neon_color, tags: (cat.tags || []).join(", "), sort_order: cat.sort_order, is_active: cat.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: TablesInsert<"categories"> = {
      title: formData.title, description: formData.description || null, image_url: formData.image_url || null,
      neon_color: formData.neon_color, tags, sort_order: formData.sort_order, is_active: formData.is_active,
    };
    if (editingCategory) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id);
      if (error) toast.error("Erro ao atualizar"); else toast.success("Categoria atualizada!");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) toast.error("Erro ao criar"); else toast.success("Categoria criada!");
    }
    resetForm();
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir"); else { toast.success("Excluído!"); onRefresh(); }
  };

  const handleToggleActive = async (cat: Category) => {
    const { error } = await supabase.from("categories").update({ is_active: !cat.is_active }).eq("id", cat.id);
    if (error) toast.error("Erro"); else onRefresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-xl font-semibold text-foreground">Categorias</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-lg hover:shadow-[0_0_20px_hsl(48_100%_50%/0.3)] transition-all active:scale-[0.98]">
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título</label>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL da Imagem</label>
              <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className={labelClass}>Cor Neon</label>
              <select value={formData.neon_color} onChange={(e) => setFormData({ ...formData, neon_color: e.target.value })} className={inputClass}>
                <option value="yellow">Amarelo</option>
                <option value="cyan">Ciano</option>
                <option value="purple">Roxo</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ordem</label>
              <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Tags (separadas por vírgula)</label>
              <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className={inputClass} placeholder="IA, Imagens, Prompts" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descrição</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass + " min-h-[80px] resize-y"} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground font-body cursor-pointer">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="accent-primary" />
              Ativo
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary text-primary-foreground font-display text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-lg hover:shadow-[0_0_20px_hsl(48_100%_50%/0.3)] transition-all">
              {editingCategory ? "Salvar" : "Criar"}
            </button>
            <button type="button" onClick={resetForm} className="border border-border text-muted-foreground font-display text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:text-foreground transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Título</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Cor</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 font-body text-sm text-foreground">{cat.title}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(cat.tags || []).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-secondary rounded font-display text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block w-3 h-3 rounded-full ${cat.neon_color === "yellow" ? "bg-neon-yellow" : cat.neon_color === "cyan" ? "bg-neon-cyan" : "bg-neon-purple"}`} />
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleToggleActive(cat)} className="text-muted-foreground hover:text-foreground transition-colors" title={cat.is_active ? "Desativar" : "Ativar"}>
                      {cat.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground font-alt text-sm">Nenhuma categoria cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoriesAdmin;
