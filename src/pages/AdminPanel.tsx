import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Home, LayoutGrid, FileText } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import ContentItemsAdmin from "@/components/admin/ContentItemsAdmin";

type Category = Tables<"categories">;

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"categories" | "content">("categories");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchCategories();
  }, [isAdmin]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Erro ao carregar categorias");
    else setCategories(data || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-alt">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabClass = (tab: string) =>
    `inline-flex items-center gap-2 px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
      activeTab === tab
        ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(48_100%_50%/0.2)]"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold">
            <span className="neon-text-yellow">Admin</span>
            <span className="text-foreground"> Panel</span>
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Home">
              <Home size={18} />
            </button>
            <button onClick={() => { signOut(); navigate("/"); }} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab("categories")} className={tabClass("categories")}>
            <LayoutGrid size={15} /> Categorias
          </button>
          <button onClick={() => setActiveTab("content")} className={tabClass("content")}>
            <FileText size={15} /> Conteúdos
          </button>
        </div>

        {activeTab === "categories" && (
          <CategoriesAdmin categories={categories} onRefresh={fetchCategories} />
        )}
        {activeTab === "content" && (
          <ContentItemsAdmin categories={categories} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
