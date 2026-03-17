import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  neonColor: "yellow" | "cyan" | "purple";
  index: number;
}

const neonClasses = {
  yellow: "neon-border-yellow",
  cyan: "neon-border-cyan",
  purple: "neon-border-purple",
};

const tagColors = {
  yellow: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
  purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
};

const CategoryCard = ({ title, description, image, tags, neonColor, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.2, 0, 0, 1] }}
      whileTap={{ scale: 0.98 }}
      className={`group relative rounded-xl bg-card border border-border overflow-hidden cursor-pointer card-glow-hover`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-display tracking-wider uppercase px-2 py-1 rounded border ${tagColors[neonColor]}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-tight">
          {title}
        </h3>

        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Bottom accent line */}
        <div
          className={`mt-4 h-px w-0 group-hover:w-full transition-all duration-500 ${
            neonColor === "yellow"
              ? "bg-neon-yellow"
              : neonColor === "cyan"
              ? "bg-neon-cyan"
              : "bg-neon-purple"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default CategoryCard;
