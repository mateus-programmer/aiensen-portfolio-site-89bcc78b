import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, Search, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Category = Tables<"categories">;
type ContentItem = Tables<"content_items">;

interface ContentItemsAdminProps {
  categories: Category[];
}

const inputClass = "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass = "block font-alt text-xs text-muted-foreground mb-1.5 uppercase tracking-wider";

const ITEMS_PER_PAGE = 10;

const ContentItemsAdmin = ({ categories }: ContentItemsAdminProps) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("sort_order");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    content: "",
    tags: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryId) {
      setCurrentPage(1);
      fetchItems(1);
    }
  }, [selectedCategoryId, searchQuery, selectedTag, sortColumn, sortAsc]);

  const fetchItems = async (page = currentPage) => {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Build base query for count
    let countQuery = supabase
      .from("content_items")
      .select("*", { count: "exact", head: true })
      .eq("category_id", selectedCategoryId);

    if (searchQuery.trim()) {
      countQuery = countQuery.ilike("title", `%${searchQuery.trim()}%`);
    }
    if (selectedTag) {
      countQuery = countQuery.contains("tags", [selectedTag]);
    }

    const { count } = await countQuery;
    setTotalCount(count || 0);

    // Build data query
    let dataQuery = supabase
      .from("content_items")
      .select("*")
      .eq("category_id", selectedCategoryId)
      .order("sort_order", { ascending: true })
      .range(from, to);

    if (searchQuery.trim()) {
      dataQuery = dataQuery.ilike("title", `%${searchQuery.trim()}%`);
    }
    if (selectedTag) {
      dataQuery = dataQuery.contains("tags", [selectedTag]);
    }

    const { data, error } = await dataQuery;
    if (error) toast.error("Erro ao carregar conteúdos");
    else setItems(data || []);

    // Fetch all tags for this category (unfiltered)
    const { data: allItems } = await supabase
      .from("content_items")
      .select("tags")
      .eq("category_id", selectedCategoryId);
    const tagSet = new Set<string>();
    (allItems || []).forEach(item => (item.tags || []).forEach(t => tagSet.add(t)));
    setAllTags(Array.from(tagSet).sort());
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchItems(page);
  };

  const resetForm = () => {
    setFormData({ category_id: selectedCategoryId, title: "", description: "", content: "", tags: "", sort_order: 0, is_active: true });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      title: item.title,
      description: item.description || "",
      content: item.content || "",
      tags: (item.tags || []).join(", "),
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: TablesInsert<"content_items"> = {
      category_id: formData.category_id || selectedCategoryId,
      title: formData.title,
      description: formData.description || null,
      content: formData.content || null,
      tags,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      const { error } = await supabase.from("content_items").update(payload).eq("id", editingItem.id);
      if (error) toast.error("Erro ao atualizar"); else toast.success("Conteúdo atualizado!");
    } else {
      const { error } = await supabase.from("content_items").insert(payload);
      if (error) toast.error("Erro ao criar"); else toast.success("Conteúdo criado!");
    }
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este conteúdo?")) return;
    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir"); else { toast.success("Excluído!"); fetchItems(); }
  };

  const handleToggleActive = async (item: ContentItem) => {
    const { error } = await supabase.from("content_items").update({ is_active: !item.is_active }).eq("id", item.id);
    if (error) toast.error("Erro"); else fetchItems();
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <>
      {/* Category filter */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display text-xl font-semibold text-foreground">Conteúdos</h2>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { resetForm(); setFormData((f) => ({ ...f, category_id: selectedCategoryId })); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-lg hover:shadow-[0_0_20px_hsl(48_100%_50%/0.3)] transition-all active:scale-[0.98]"
        >
          <Plus size={16} /> Novo Conteúdo
        </button>
      </div>

      {/* Search & Tag Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-8 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        {allTags.length > 0 && (
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Todas as tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
        {(searchQuery || selectedTag) && (
          <button
            onClick={() => { setSearchQuery(""); setSelectedTag(""); }}
            className="text-xs text-muted-foreground hover:text-foreground font-display uppercase tracking-wider transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            {editingItem ? "Editar Conteúdo" : "Novo Conteúdo"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título</label>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className={inputClass}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ordem</label>
              <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tags (separadas por vírgula)</label>
              <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className={inputClass} placeholder="Tag1, Tag2" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descrição</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass + " min-h-[60px] resize-y"} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Conteúdo / Prompt</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className={inputClass + " min-h-[120px] resize-y font-mono text-xs"} placeholder="Cole o prompt ou conteúdo completo aqui..." />
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
              {editingItem ? "Salvar" : "Criar"}
            </button>
            <button type="button" onClick={resetForm} className="border border-border text-muted-foreground font-display text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:text-foreground transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Título</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Descrição</th>
                <th className="text-left px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-display text-xs uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 font-body text-sm text-foreground max-w-[200px] truncate">{item.title}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(item.tags || []).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-secondary rounded font-display text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="font-body text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{item.description}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleToggleActive(item)} className="text-muted-foreground hover:text-foreground transition-colors" title={item.is_active ? "Desativar" : "Ativar"}>
                      {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground font-alt text-sm">
                    Nenhum conteúdo nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground font-alt">
              Página {currentPage} de {totalPages} ({totalCount} itens)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<number[]>((acc, p) => {
                  if (acc.length > 0 && p - acc[acc.length - 1] > 1) acc.push(-1);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === -1 ? (
                    <span key={`e${i}`} className="px-1 text-muted-foreground text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`min-w-[28px] h-7 rounded text-xs font-display transition-all ${
                        p === currentPage
                          ? "bg-primary text-primary-foreground shadow-[0_0_10px_hsl(48_100%_50%/0.2)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentItemsAdmin;
