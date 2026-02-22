import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { menuItems, MenuItem } from "@/data/menu";
import MenuItemModal from "./MenuItemModal";
import burgerImg from "@/assets/burger.png";

const MenuSection = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <section id="cardapio" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground uppercase">
            Nosso <span className="text-gradient">Cardápio</span>
          </h2>
          <p className="text-muted-foreground mt-3">Escolha seu favorito e faça seu pedido!</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={burgerImg}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-xl text-foreground">{item.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-2xl">R$ {item.price.toFixed(2)}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

export default MenuSection;
