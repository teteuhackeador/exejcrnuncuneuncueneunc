import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin, CreditCard, Banknote, QrCode, Store, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "cart" | "checkout";
type PaymentMethod = "pix" | "credito" | "dinheiro" | "";
type DeliveryType = "delivery" | "retirada" | "";

interface Address {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  referencia: string;
}

const emptyAddress: Address = { rua: "", numero: "", bairro: "", complemento: "", referencia: "" };

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [payment, setPayment] = useState<PaymentMethod>("");
  const [delivery, setDelivery] = useState<DeliveryType>("");
  const [address, setAddress] = useState<Address>(emptyAddress);

  const resetCheckout = () => {
    setStep("cart");
    setPayment("");
    setDelivery("");
    setAddress(emptyAddress);
  };

  const handleClose = () => {
    resetCheckout();
    onClose();
  };

  const canFinalize = payment !== "" && delivery !== "" && (delivery === "retirada" || (address.rua && address.numero && address.bairro));

  const handleFinalize = () => {
    if (!canFinalize) return;

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

    const paymentLabels: Record<string, string> = { pix: "PIX", credito: "Cartão de Crédito", dinheiro: "Dinheiro" };
    const deliveryLabel = delivery === "delivery" ? "Delivery" : "Retirada no estabelecimento";

    let message = `Olá! Gostaria de pedir:\n\n${lines.join("\n\n")}\n\nTotal: R$ ${totalPrice.toFixed(2)}\n\n💳 Pagamento: ${paymentLabels[payment]}\n🚚 Entrega: ${deliveryLabel}`;

    if (delivery === "delivery") {
      const sanitize = (s: string) => s.trim().slice(0, 200);
      message += `\n\n📍 Endereço:\nRua: ${sanitize(address.rua)}, Nº ${sanitize(address.numero)}\nBairro: ${sanitize(address.bairro)}`;
      if (address.complemento.trim()) message += `\nComplemento: ${sanitize(address.complemento)}`;
      if (address.referencia.trim()) message += `\nReferência: ${sanitize(address.referencia)}`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5533999999959?text=${encoded}`, "_blank");
    clearCart();
    resetCheckout();
    onClose();
  };

  const paymentOptions = [
    { value: "pix" as const, label: "PIX", icon: QrCode },
    { value: "credito" as const, label: "Cartão", icon: CreditCard },
    { value: "dinheiro" as const, label: "Dinheiro", icon: Banknote },
  ];

  const deliveryOptions = [
    { value: "delivery" as const, label: "Delivery", icon: Truck },
    { value: "retirada" as const, label: "Retirar", icon: Store },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                {step === "checkout" && (
                  <button onClick={() => setStep("cart")} className="p-1 hover:bg-secondary rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                )}
                <ShoppingBag className="w-6 h-6 text-primary" />
                {step === "cart" ? "Carrinho" : "Finalizar"}
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {step === "cart" && (
                <>
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
                                <p className="text-xs text-muted-foreground mt-1">+ {item.additionals.map((a) => a.name).join(", ")}</p>
                              )}
                              {item.removals.length > 0 && (
                                <p className="text-xs text-muted-foreground">Sem: {item.removals.join(", ")}</p>
                              )}
                              {item.observation && (
                                <p className="text-xs text-muted-foreground italic">"{item.observation}"</p>
                              )}
                            </div>
                            <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                                <Minus className="w-3 h-3 text-foreground" />
                              </button>
                              <span className="font-bold text-foreground">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Plus className="w-3 h-3 text-primary-foreground" />
                              </button>
                            </div>
                            <span className="font-bold text-primary">R$ {itemTotal.toFixed(2)}</span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </>
              )}

              {step === "checkout" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Payment */}
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Forma de Pagamento
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setPayment(opt.value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            payment === opt.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          <opt.icon className="w-6 h-6" />
                          <span className="text-xs font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery */}
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Tipo de Entrega
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {deliveryOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setDelivery(opt.value); if (opt.value === "retirada") setAddress(emptyAddress); }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            delivery === opt.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          <opt.icon className="w-6 h-6" />
                          <span className="text-xs font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <AnimatePresence>
                    {delivery === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Endereço de Entrega
                        </h3>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Rua *"
                            maxLength={200}
                            value={address.rua}
                            onChange={(e) => setAddress((a) => ({ ...a, rua: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Número *"
                              maxLength={20}
                              value={address.numero}
                              onChange={(e) => setAddress((a) => ({ ...a, numero: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Bairro *"
                              maxLength={100}
                              value={address.bairro}
                              onChange={(e) => setAddress((a) => ({ ...a, bairro: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Complemento (opcional)"
                            maxLength={200}
                            value={address.complemento}
                            onChange={(e) => setAddress((a) => ({ ...a, complemento: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Ponto de referência (opcional)"
                            maxLength={200}
                            value={address.referencia}
                            onChange={(e) => setAddress((a) => ({ ...a, referencia: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>
                {step === "cart" ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("checkout")}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-display font-bold text-lg uppercase tracking-wider shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continuar
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinalize}
                    disabled={!canFinalize}
                    className={`w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 ${
                      canFinalize
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Finalizar Pedido via WhatsApp
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
