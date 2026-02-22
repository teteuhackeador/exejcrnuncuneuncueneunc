import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const HeroSection = () => {
  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary opacity-90" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tight leading-tight">
              <span className="text-gradient">Hamburgueria</span>
              <br />
              <span className="text-foreground">Modelo</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md">
              Os melhores hambúrgueres artesanais da cidade. Feitos com ingredientes frescos e muito sabor! 🔥
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToMenu}
              className="mt-8 px-10 py-4 bg-primary text-primary-foreground rounded-full text-lg font-display font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 mx-auto md:mx-0"
            >
              Peça Agora <ShoppingBag className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Hambúrguer artesanal premium"
              className="w-72 md:w-[500px] rounded-3xl shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
