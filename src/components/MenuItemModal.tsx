import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { MenuItem, additionalOptions, removableIngredients } from "@/data/menu";
import { useCart, CartItemAdditional } from "@/context/CartContext";
import burgerImg from "@/assets/burger.png";

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemModal = ({ item, onClose }: Props) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<CartItemAdditional[]>([]);
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [observation, setObservation] = useState("");

  const toggleAdditional = (add: CartItemAdditional) => {
    setSelectedAdditionals((prev) =>
      prev.find((a) => a.name === add.name)
        ? prev.filter((a) => a.name !== add.name)
        : [...prev, add]
    );
  };

  const toggleRemoval = (name: string) => {
    setSelectedRemovals((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };

  const additionalsTotal = selectedAdditionals.reduce((s, a) => s + a.price, 0);
  const unitPrice = item.price + additionalsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addItem({
      id: "",
      name: item.name,
      price: item.price,
      quantity,
      additionals: selectedAdditionals,
      removals: selectedRemovals,
      observation,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="relative">
            <img src={burgerImg} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-background transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground">{item.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              <p className="text-primary font-bold text-xl mt-2">R$ {item.price.toFixed(2)}</p>
            </div>

            {/* Adicionais */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-2">Adicionais</h4>
              <div className="space-y-2">
                {additionalOptions.map((add) => (
                  <label
                    key={add.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selectedAdditionals.find((a) => a.name === add.name)}
                        onChange={() => toggleAdditional(add)}
                        className="w-5 h-5 accent-primary rounded"
                      />
                      <span className="text-foreground">{add.name}</span>
                    </div>
                    <span className="text-primary font-semibold">+R$ {add.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Remover ingredientes */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-2">Remover Ingredientes</h4>
              <div className="space-y-2">
                {removableIngredients.map((ing) => (
                  <label
                    key={ing}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary cursor-pointer hover:bg-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRemovals.includes(ing)}
                      onChange={() => toggleRemoval(ing)}
                      className="w-5 h-5 accent-accent rounded"
                    />
                    <span className="text-foreground">Sem {ing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observação */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-2">Observação</h4>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ex: Ponto da carne bem passado..."
                className="w-full p-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border-none resize-none focus:ring-2 focus:ring-primary outline-none"
                rows={3}
              />
            </div>

            {/* Quantidade */}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-foreground">Quantidade</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4 text-foreground" />
                </button>
                <span className="text-xl font-bold text-foreground w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Botão Adicionar */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-display font-bold text-lg uppercase tracking-wider shadow-lg hover:shadow-xl transition-shadow"
            >
              Adicionar ao Carrinho — R$ {totalPrice.toFixed(2)}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MenuItemModal;
