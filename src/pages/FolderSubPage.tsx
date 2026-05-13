import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Lock, FolderOpen, Folder } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { semesters } from "@/components/SemesterCards";
import { foldersBySemester } from "@/data/semesterFolders";
import FolderCards from "@/components/FolderCards";
import PdfUpload from "@/components/PdfUpload";
import PdfFileItem from "@/components/PdfFileItem";
import type { Tables } from "@/integrations/supabase/types";

type ContentItem = Tables<"content_items">;

const FolderSubPage = () => {
  const [search, setSearch] = useState("");
  const { id, slug, folderSlug, subSlug } = useParams<{
    id: string;
    slug: string;
    folderSlug: string;
    subSlug?: string;
  }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const semester = semesters.find((s) => s.slug === slug);
  const folder = (foldersBySemester[slug || ""] || []).find(
    (f) => f.slug === folderSlug
  );
  const subfolder = subSlug
    ? folder?.subfolders.find((sf) => sf.slug === subSlug)
    : undefined;

  const activeTag = subfolder?.tag || folder?.tag || "";
  const accentHsl = subfolder?.accentHsl || folder?.accentHsl || "190 95% 60%";
  const accent = `hsl(${accentHsl})`;
  const Icon = subfolder ? Folder : FolderOpen;
  const title = subfolder?.name || folder?.name || "";
  const code = subfolder?.code || folder?.code || "";
  const description = subfolder?.description || folder?.description || "";

  const queryKey = ["content_items", id, "pasta", folderSlug, subSlug || "_root", user?.id];

  const { data: items } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("category_id", id!)
        .eq("is_active", true)
        .contains("tags", [activeTag])
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!id && !!user && !!activeTag,
  });

  if (!semester || !folder || (subSlug && !subfolder)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-alt">Pasta não encontrada.</p>
        <button
          onClick={() => navigate(`/categoria/${id}/semestre/${slug}`)}
          className="text-primary font-display text-sm hover:underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  const backTo = subfolder
    ? `/categoria/${id}/semestre/${slug}/pasta/${folderSlug}`
    : `/categoria/${id}/semestre/${slug}`;

  // Hide content items belonging to subfolders when viewing the parent folder
  const subTags = new Set(folder.subfolders.map((sf) => sf.tag));
  const visibleItems = subfolder
    ? items
    : items?.filter((it) => !(it.tags || []).some((t) => subTags.has(t)));

  const uploadTags = subfolder
    ? [semester.tag, folder.tag, subfolder.tag]
    : [semester.tag, folder.tag];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(backTo)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <Icon size={18} style={{ color: accent }} />
          <h1 className="font-display text-lg font-bold" style={{ color: accent }}>
            {title}
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            {code} · {semester.name}
            {subfolder && ` · ${folder.name}`}
          </span>
          <p className="font-body text-muted-foreground text-sm mt-2">
            {description}
          </p>
        </motion.div>

        {!subfolder && folder.subfolders.length > 0 && (
          <FolderCards
            heading="subdirectories.matrix"
            variant="subfolder"
            items={folder.subfolders}
            onOpen={(sub) =>
              navigate(`/categoria/${id}/semestre/${slug}/pasta/${folderSlug}/sub/${sub}`)
            }
          />
        )}

        {!user && !authLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Lock size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-alt text-muted-foreground text-sm mb-4">
              Faça login para acessar os conteúdos.
            </p>
            <button
              onClick={() =>
                navigate(
                  `/auth?redirect=${encodeURIComponent(
                    `/categoria/${id}/semestre/${slug}/pasta/${folderSlug}${
                      subSlug ? `/sub/${subSlug}` : ""
                    }`
                  )}`
                )
              }
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
                defaultTags={uploadTags}
                onUploadComplete={() =>
                  queryClient.invalidateQueries({ queryKey })
                }
              />
            )}

            {visibleItems && visibleItems.length > 0 && (
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
                  placeholder={`Buscar em ${title}...`}
                  className="w-full bg-secondary border border-border rounded-lg pl-11 pr-4 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            )}

            {(() => {
              const query = search.toLowerCase().trim();
              const filtered =
                visibleItems && query
                  ? visibleItems.filter(
                      (item) =>
                        item.title.toLowerCase().includes(query) ||
                        (item.description || "").toLowerCase().includes(query) ||
                        (item.content || "").toLowerCase().includes(query) ||
                        (item.tags || []).some((t) =>
                          t.toLowerCase().includes(query)
                        )
                    )
                  : visibleItems;

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
                            neonColor="cyan"
                            index={i}
                            isAdmin={isAdmin}
                            onDeleted={() =>
                              queryClient.invalidateQueries({ queryKey })
                            }
                          />
                        );
                      }
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="bg-card border border-border rounded-xl p-5 border-l-4 hover:bg-secondary/30 transition-colors"
                          style={{ borderLeftColor: accent }}
                        >
                          <div className="flex items-start gap-4">
                            <FileText
                              size={18}
                              className="mt-0.5 text-muted-foreground"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">
                                  {item.description}
                                </p>
                              )}
                              {item.content && (
                                <div className="bg-secondary/50 rounded-lg p-4 mt-3">
                                  <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap break-words">
                                    {item.content}
                                  </pre>
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

              if (visibleItems && visibleItems.length > 0 && query) {
                return (
                  <p className="text-center text-muted-foreground font-alt text-sm py-12">
                    Nenhum conteúdo encontrado para "{search}".
                  </p>
                );
              }

              if (!subfolder && folder.subfolders.length > 0) return null;

              return (
                <div className="text-center py-20">
                  <FileText
                    size={40}
                    className="mx-auto text-muted-foreground/30 mb-4"
                  />
                  <p className="font-alt text-muted-foreground text-sm">
                    Nenhum conteúdo disponível em {title} ainda.
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

export default FolderSubPage;
