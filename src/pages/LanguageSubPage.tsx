import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { languages } from "@/components/ProgrammingLanguageCards";
import PdfUpload from "@/components/PdfUpload";
import PdfFileItem from "@/components/PdfFileItem";
import type { Tables } from "@/integrations/supabase/types";

type ContentItem = Tables<"content_items">;

const LanguageSubPage = () => {
  const [search, setSearch] = useState("");
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const lang = languages.find((l) => l.slug === slug);

  const { data: items, isLoading } = useQuery({
    queryKey: ["content_items", id, slug, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("category_id", id!)
        .eq("is_active", true)
        .contains("tags", [lang?.name || ""])
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!id && !!user && !!lang,
  });

  if (!lang) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-alt">Linguagem não encontrada.</p>
        <button onClick={() => navigate(`/categoria/${id}`)} className="text-primary font-display text-sm hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(`/categoria/${id}`)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-2xl">{lang.icon}</span>
          <h1 className={`font-display text-lg font-bold ${lang.color}`}>
            {lang.name}
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-muted-foreground text-sm mb-8"
        >
          {lang.description}
        </motion.p>

        {!user && !authLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Lock size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-alt text-muted-foreground text-sm mb-4">
              Faça login para acessar os conteúdos.
            </p>
            <button
              onClick={() => navigate(`/auth?redirect=${encodeURIComponent(`/categoria/${id}/linguagem/${slug}`)}`)}
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
                defaultTags={[lang.name]}
                onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["content_items", id, slug] })}
              />
            )}

            {items && items.length > 0 && (
              <div className="relative max-w-md mb-6">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Buscar em ${lang.name}...`}
                  className="w-full bg-secondary border border-border rounded-lg pl-11 pr-4 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            )}

            {(() => {
              const query = search.toLowerCase().trim();
              const filtered = items && query
                ? items.filter((item) =>
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
                      if (item.file_url) {
                        return (
                          <PdfFileItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            fileUrl={item.file_url}
                            neonColor="yellow"
                            index={i}
                            isAdmin={isAdmin}
                            onDeleted={() => queryClient.invalidateQueries({ queryKey: ["content_items", id, slug] })}
                          />
                        );
                      }
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-neon-yellow hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <FileText size={18} className="mt-0.5 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                              {item.description && <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">{item.description}</p>}
                              {item.content && (
                                <div className="bg-secondary/50 rounded-lg p-4 mt-3">
                                  <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap break-words">{item.content}</pre>
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
                return <p className="text-center text-muted-foreground font-alt text-sm py-12">Nenhum conteúdo encontrado para "{search}".</p>;
              }

              return (
                <div className="text-center py-20">
                  <FileText size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-alt text-muted-foreground text-sm">Nenhum conteúdo disponível para {lang.name} ainda.</p>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSubPage;
