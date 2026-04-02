import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

interface LanguageInfo {
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

const languages: LanguageInfo[] = [
  {
    name: "HTML",
    slug: "html",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: "🌐",
    description: "Estrutura e marcação web",
  },
  {
    name: "CSS",
    slug: "css",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: "🎨",
    description: "Estilização e layout",
  },
  {
    name: "Python",
    slug: "python",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: "🐍",
    description: "Ciência de dados e automação",
  },
  {
    name: "JavaScript",
    slug: "javascript",
    color: "text-yellow-300",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    icon: "⚡",
    description: "Web interativa e full-stack",
  },
  {
    name: "Java",
    slug: "java",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: "☕",
    description: "Aplicações enterprise",
  },
  {
    name: "Lisp",
    slug: "lisp",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: "🧠",
    description: "Programação funcional e IA clássica",
  },
  {
    name: "R",
    slug: "r",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    icon: "📊",
    description: "Estatística e análise de dados",
  },
  {
    name: "Julia",
    slug: "julia",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: "🔬",
    description: "Computação científica de alto desempenho",
  },
  {
    name: "Scala",
    slug: "scala",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    icon: "🔥",
    description: "Funcional + orientado a objetos na JVM",
  },
];

interface Props {
  categoryId: string;
}

const ProgrammingLanguageCards = ({ categoryId }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {languages.map((lang, i) => (
        <motion.div
          key={lang.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          onClick={() => navigate(`/categoria/${categoryId}/linguagem/${lang.slug}`)}
          className={`group relative rounded-xl border ${lang.borderColor} ${lang.bgColor} p-5 cursor-pointer
            hover:scale-[1.03] hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl flex-shrink-0">{lang.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-display text-base font-bold ${lang.color} mb-1`}>
                {lang.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {lang.description}
              </p>
            </div>
            <Code2 size={16} className="text-muted-foreground/40 mt-1 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export { languages };
export default ProgrammingLanguageCards;
