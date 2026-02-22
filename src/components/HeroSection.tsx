import { motion } from "framer-motion";
import burgerImg from "@/assets/burger.png";

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
              className="mt-8 px-10 py-4 bg-primary text-primary-foreground rounded-full text-lg font-display font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-shadow"
            >
              Peça Agora 🍔
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={burgerImg}
              alt="Hambúrguer artesanal"
              className="w-72 md:w-96 rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
