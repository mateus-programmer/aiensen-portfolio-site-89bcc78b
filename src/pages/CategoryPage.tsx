import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import PdfUpload from "@/components/PdfUpload";
import ProgrammingLanguageCards from "@/components/ProgrammingLanguageCards";
import TheologyTopicCards, { topics as theologyTopics } from "@/components/TheologyTopicCards";
import PdfFileItem from "@/components/PdfFileItem";
import HighlightMatch from "@/components/HighlightMatch";

type Category = Tables<"categories">;
type ContentItem = Tables<"content_items">;

const neonTextClass: Record<string, string> = {
  yellow: "neon-text-yellow",
  cyan: "neon-text-cyan",
  purple: "neon-text-purple",
};

const tagColors: Record<string, string> = {
  yellow: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
  purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
};

const accentBorder: Record<string, string> = {
  yellow: "border-l-neon-yellow",
  cyan: "border-l-neon-cyan",
  purple: "border-l-neon-purple",
};

const CategoryPage = () => {
  const [search, setSearch] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Category;
    },
    enabled: !!id,
  });

  const { data: items, isLoading: loadingItems } = useQuery({
    queryKey: ["content_items", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("category_id", id!)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!id && !!user,
    select: (data) => {
      if (category?.title === "Vida & Teologia") {
        const topicNames = theologyTopics.map((t) => t.name);
        return data.filter(
          (item) => !(item.tags || []).some((tag) => topicNames.includes(tag))
        );
      }
      return data;
    },
  });

  const isLoading = loadingCategory || loadingItems || authLoading;
  const color = category?.neon_color || "yellow";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-alt">Categoria não encontrada.</p>
        <button onClick={() => navigate("/")} className="text-primary font-display text-sm hover:underline">
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-lg font-bold truncate">
            <span className={neonTextClass[color]}>{category.title}</span>
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {category.description && (
            <p className="font-body text-muted-foreground max-w-2xl text-sm leading-relaxed">
              {category.description}
            </p>
          )}
          {category.tags && category.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-display tracking-wider uppercase px-2.5 py-1 rounded border ${tagColors[color]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="relative max-w-md mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conteúdos, tags..."
            className="w-full bg-secondary border border-border rounded-lg pl-11 pr-4 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {category.title === "Cursos de Programação" && id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-5">
              Escolha uma linguagem
            </h2>
            <ProgrammingLanguageCards categoryId={id} searchQuery={search} />
          </motion.div>
        )}

        {category.title === "Vida & Teologia" && id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-5">
              Escolha um tópico
            </h2>
            <TheologyTopicCards categoryId={id} searchQuery={search} />
          </motion.div>
        )}

        {!user && !authLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Lock size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-alt text-muted-foreground text-sm mb-4">
              Faça login para acessar os conteúdos desta categoria.
            </p>
            <button
              onClick={() => navigate(`/auth?redirect=${encodeURIComponent(`/categoria/${id}`)}`)}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Entrar na conta
            </button>
          </motion.div>
        ) : (
          <>
            {isAdmin && id && (
              <PdfUpload
                categoryId={id}
                onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["content_items", id] })}
              />
            )}

            {(() => {
              const query = search.toLowerCase().trim();
              const filtered = items && query
                ? items.filter(
                    (item) =>
                      item.title.toLowerCase().includes(query) ||
                      (item.description || "").toLowerCase().includes(query) ||
                      (item.content || "").toLowerCase().includes(query) ||
                      (item.tags || []).some((t) => t.toLowerCase().includes(query))
                  )
                : items;

              if (filtered && filtered.length > 0) {
                return (
                  <div className="grid gap-4">
                    {filtered.map((item, i) => {
                      if ((item as any).file_url) {
                        return (
                          <PdfFileItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            fileUrl={(item as any).file_url}
                            neonColor={color}
                            index={i}
                            isAdmin={isAdmin}
                            onDeleted={() => queryClient.invalidateQueries({ queryKey: ["content_items", id] })}
                          />
                        );
                      }

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className={`bg-card border border-border rounded-xl p-5 border-l-4 ${accentBorder[color]} hover:bg-secondary/30 transition-colors`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-0.5 text-muted-foreground">
                              <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                                <HighlightMatch text={item.title} query={search} />
                              </h3>
                              {item.description && (
                                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">
                                  <HighlightMatch text={item.description} query={search} />
                                </p>
                              )}
                              {item.content && (
                                <div className="bg-secondary/50 rounded-lg p-4 mt-3">
                                  <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap break-words">
                                    <HighlightMatch text={item.content} query={search} />
                                  </pre>
                                </div>
                              )}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] font-display tracking-wider uppercase px-2 py-0.5 rounded bg-secondary text-muted-foreground"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              }

              if (items && items.length > 0 && query) {
                return (
                  <p className="text-center text-muted-foreground font-alt text-sm py-12">
                    Nenhum conteúdo encontrado para "{search}".
                  </p>
                );
              }

              if ((category.title === "Cursos de Programação" || category.title === "Vida & Teologia") && (!items || items.length === 0)) {
                return null;
              }

              return (
                <div className="text-center py-20">
                  <FileText size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-alt text-muted-foreground text-sm">
                    Nenhum conteúdo disponível nesta categoria ainda.
                  </p>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
