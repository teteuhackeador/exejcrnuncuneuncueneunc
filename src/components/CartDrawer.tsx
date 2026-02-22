import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const handleFinalize = () => {
    if (items.length === 0) return;

    const lines = items.map((item) => {
      let line = `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;
      if (item.additionals.length > 0) {
        line += `\n  Adicionais: ${item.additionals.map((a) => a.name).join(", ")}`;
      }
      if (item.removals.length > 0) {
        line += `\n  Sem: ${item.removals.join(", ")}`;
      }
      if (item.observation) {
        line += `\n  Obs: ${item.observation}`;
      }
      return line;
    });

    const message = `Olá! Gostaria de pedir:\n\n${lines.join("\n\n")}\n\nTotal: R$ ${totalPrice.toFixed(2)}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5533999999959?text=${encoded}`, "_blank");
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Carrinho
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <p className="text-sm mt-1">Adicione itens do cardápio!</p>
                </div>
              ) : (
                items.map((item) => {
                  const additionalsPrice = item.additionals.reduce((s, a) => s + a.price, 0);
                  const itemTotal = (item.price + additionalsPrice) * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-secondary rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-foreground">{item.name}</h4>
                          {item.additionals.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              + {item.additionals.map((a) => a.name).join(", ")}
                            </p>
                          )}
                          {item.removals.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Sem: {item.removals.join(", ")}
                            </p>
                          )}
                          {item.observation && (
                            <p className="text-xs text-muted-foreground italic">"{item.observation}"</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-card flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3 text-foreground" />
                          </button>
                          <span className="font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3 text-primary-foreground" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">R$ {itemTotal.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinalize}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-display font-bold text-lg uppercase tracking-wider shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  Finalizar Pedido via WhatsApp
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
