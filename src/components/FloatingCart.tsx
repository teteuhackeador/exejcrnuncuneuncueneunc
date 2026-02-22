import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: Props) => {
  const { totalItems } = useCart();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center"
    >
      <ShoppingCart className="w-7 h-7" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FloatingCart;
