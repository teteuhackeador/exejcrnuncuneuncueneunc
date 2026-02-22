import { Sun, Moon, ChefHat } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-xl uppercase text-foreground flex items-center gap-2">
          <ChefHat className="text-primary w-6 h-6" /> Hamburgueria <span className="text-primary">Modelo</span>
        </a>

        <div className="flex items-center gap-6">
          <a href="#cardapio" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Cardápio
          </a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sobre
          </a>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
