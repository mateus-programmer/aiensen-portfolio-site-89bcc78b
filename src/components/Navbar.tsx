import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Shield, LogOut, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Home", href: "#" },
  { label: "Sobre o Projeto", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-bold tracking-tight">
          <span className="neon-text-yellow">AI</span>
          <span className="text-foreground">ensen</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="font-alt text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="inline-flex items-center gap-1.5 font-alt text-sm text-neon-yellow hover:text-primary transition-colors">
                  <Shield size={14} /> Admin
                </button>
              )}
              <button onClick={() => signOut()} className="inline-flex items-center gap-1.5 font-alt text-sm text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={14} /> Sair
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/auth")} className="inline-flex items-center gap-1.5 font-alt text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogIn size={14} /> Entrar
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="font-alt text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </a>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <button onClick={() => { setOpen(false); navigate("/admin"); }} className="text-left font-alt text-sm text-neon-yellow">
                      Admin Panel
                    </button>
                  )}
                  <button onClick={() => { setOpen(false); signOut(); }} className="text-left font-alt text-sm text-muted-foreground">
                    Sair
                  </button>
                </>
              ) : (
                <button onClick={() => { setOpen(false); navigate("/auth"); }} className="text-left font-alt text-sm text-muted-foreground">
                  Entrar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
