import { motion } from "framer-motion";
import { Brain, Zap, Layers } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description: "Prompts otimizados para as plataformas mais avançadas de IA generativa.",
  },
  {
    icon: Layers,
    title: "Organização Modular",
    description: "Conteúdos organizados em categorias para acesso rápido e eficiente.",
  },
  {
    icon: Zap,
    title: "Alta Performance",
    description: "Plataforma rápida e responsiva, projetada para qualquer dispositivo.",
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Sobre <span className="neon-text-yellow">mim</span>
          </h2>
          <p className="font-alt text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Eu criei o AIensen como uma plataforma pessoal que combina Inteligência Artificial com o meu sobrenome —
            funcionando como um hub central para organizar e acessar prompts, cursos e materiais temáticos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center p-8 rounded-xl bg-card border border-border card-glow-hover"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="text-primary" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-base font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
