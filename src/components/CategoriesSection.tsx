import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategoryCard from "./CategoryCard";
import cardPromptsImagens from "@/assets/card-prompts-imagens.jpg";
import cardPromptsVideos from "@/assets/card-prompts-videos.jpg";
import cardCursos from "@/assets/card-cursos.jpg";
import cardSermoes from "@/assets/card-sermoes.jpg";
import cardFeminismo from "@/assets/card-feminismo.jpg";
import cardCapSoc from "@/assets/card-capitalismo-socialismo.jpg";
import cardCapCom from "@/assets/card-capitalismo-comunismo.jpg";
import cardIdeologiaGenero from "@/assets/card-ideologia-genero.jpg";
import cardAborto from "@/assets/card-aborto.jpg";
import cardDrogas from "@/assets/card-legalizacao-drogas.jpg";
import cardHistorias from "@/assets/card-historias-infantis.jpg";
import cardEngenharia from "@/assets/card-aulas-engenharia.jpg";

const fallbackImages: Record<string, string> = {
  "Prompts para Imagens": cardPromptsImagens,
  "Prompts para Vídeos": cardPromptsVideos,
  "Cursos de Programação": cardCursos,
  "Prompts para Sermões": cardSermoes,
  "Prompts sobre Feminismo": cardFeminismo,
  "Prompts: Capitalismo x Socialismo": cardCapSoc,
  "Prompts: Capitalismo x Comunismo": cardCapCom,
  "Prompts: Ideologia de Gênero": cardIdeologiaGenero,
  "Prompts sobre Aborto": cardAborto,
  "Prompts: Legalização das Drogas": cardDrogas,
  "Prompts para Histórias Infantis": cardHistorias,
  "Aulas Engenharia de Software": cardEngenharia,
};

const staticCategories = [
  { title: "Prompts para Imagens", description: "Coleção de prompts otimizados para geração de imagens com IA — arte digital, fotorrealismo, conceitos e mais.", image: cardPromptsImagens, tags: ["IA Generativa", "Imagens"], neonColor: "yellow" as const },
  { title: "Prompts para Vídeos", description: "Prompts para criação de vídeos com durações de 5s a 60s — otimizados para as melhores plataformas de IA.", image: cardPromptsVideos, tags: ["Vídeo", "5s–60s"], neonColor: "cyan" as const },
  { title: "Cursos de Programação", description: "Trilhas completas de Python, JavaScript e Java — do básico ao avançado com projetos práticos.", image: cardCursos, tags: ["Python", "JavaScript", "Java"], neonColor: "yellow" as const },
  { title: "Prompts para Sermões", description: "Prompts especializados para sermões expositivos, temáticos e textuais com estrutura profissional.", image: cardSermoes, tags: ["Expositivo", "Temático", "Textual"], neonColor: "purple" as const },
  { title: "Prompts sobre Feminismo", description: "Prompts aprofundados para análise crítica do feminismo — perspectivas históricas, filosóficas e teológicas.", image: cardFeminismo, tags: ["Feminismo", "Análise Crítica"], neonColor: "purple" as const },
  { title: "Prompts: Capitalismo x Socialismo", description: "Prompts para debates e análises comparativas entre capitalismo e socialismo.", image: cardCapSoc, tags: ["Capitalismo", "Socialismo", "Economia"], neonColor: "cyan" as const },
  { title: "Prompts: Capitalismo x Comunismo", description: "Prompts para explorar as diferenças fundamentais entre capitalismo e comunismo.", image: cardCapCom, tags: ["Capitalismo", "Comunismo", "Política"], neonColor: "cyan" as const },
  { title: "Prompts: Ideologia de Gênero", description: "Prompts para análise crítica sobre ideologia de gênero — perspectivas bíblicas, científicas e filosóficas.", image: cardIdeologiaGenero, tags: ["Ideologia de Gênero", "Análise"], neonColor: "purple" as const },
  { title: "Prompts sobre Aborto", description: "Prompts para debates estruturados sobre aborto — argumentos éticos, científicos, jurídicos e teológicos.", image: cardAborto, tags: ["Aborto", "Ética", "Bioética"], neonColor: "purple" as const },
  { title: "Prompts: Legalização das Drogas", description: "Prompts para análise crítica sobre legalização das drogas — impactos sociais, econômicos e de saúde pública.", image: cardDrogas, tags: ["Drogas", "Política Pública", "Sociedade"], neonColor: "cyan" as const },
  { title: "Prompts para Histórias Infantis", description: "Prompts criativos para geração de histórias infantis e juvenis — contos de fadas, aventuras, fábulas e narrativas educativas.", image: cardHistorias, tags: ["Infantil", "Juvenil", "Histórias"], neonColor: "cyan" as const },
];

const CategoriesSection = () => {
  const { data: dbCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      return data;
    },
  });

  const categories = dbCategories && dbCategories.length > 0
    ? dbCategories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        description: cat.description || "",
        image: cat.image_url || fallbackImages[cat.title] || cardPromptsImagens,
        tags: cat.tags || [],
        neonColor: (cat.neon_color as "yellow" | "cyan" | "purple") || "yellow",
      }))
    : staticCategories;

  return (
    <section id="categorias" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="neon-text-cyan">Módulos</span>{" "}
            <span className="text-foreground">de Conteúdo</span>
          </h2>
          <p className="font-alt text-muted-foreground max-w-xl mx-auto">
            Explore cada categoria e acesse uma biblioteca completa de prompts, cursos e materiais temáticos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.title} {...cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
