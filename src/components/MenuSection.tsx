import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { menuItems, MenuItem } from "@/data/menu";
import MenuItemModal from "./MenuItemModal";

const MenuSection = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'burger' | 'drink'>('burger');

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

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

        {/* Categoria Tabs */}
        <div className="flex justify-center gap-3 mb-8 md:mb-12">
          <button
            onClick={() => setActiveCategory('burger')}
            className={`px-5 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base transition-all ${activeCategory === 'burger'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20'
              }`}
          >
            Hambúrgueres
          </button>
          <button
            onClick={() => setActiveCategory('drink')}
            className={`px-5 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base transition-all ${activeCategory === 'drink'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20'
              }`}
          >
            Bebidas
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-[4/3] sm:aspect-auto sm:h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-sm md:text-xl text-foreground line-clamp-1">{item.name}</h3>
                <p className="text-muted-foreground text-[10px] md:text-sm mt-1 line-clamp-2 leading-tight md:leading-normal flex-1">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 md:mt-4 gap-2">
                  <span className="text-primary font-bold text-base md:text-2xl whitespace-nowrap">R$ {item.price.toFixed(2)}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-5 py-2 md:py-2.5 bg-primary text-primary-foreground rounded-full font-semibold text-[10px] md:text-sm hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Adicionar</span>
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
