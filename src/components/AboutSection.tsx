import { motion } from "framer-motion";

const AboutSection = () => (
  <section id="sobre" className="py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Chef preparando hambúrguer"
            className="rounded-2xl shadow-xl w-full max-w-md mx-auto object-cover h-[450px]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-display font-bold uppercase text-foreground">
            Sobre <span className="text-gradient">Nós</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A Hamburgueria Modelo nasceu da paixão por hambúrgueres artesanais de verdade.
            Cada ingrediente é selecionado com cuidado e nossos blends são preparados diariamente
            para garantir frescor e sabor inigualável.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Nosso compromisso é entregar qualidade, rapidez e a melhor experiência
            gastronômica direto na sua porta. Peça pelo WhatsApp e comprove! 🔥
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
