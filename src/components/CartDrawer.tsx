import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin, CreditCard, Banknote, QrCode, Store, Truck, Bike } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { encodeOrder, OrderPayload } from "@/utils/orderHash";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [addressRua, setAddressRua] = useState("");
  const [addressNumero, setAddressNumero] = useState("");
  const [addressBairro, setAddressBairro] = useState("");
  const [addressComplemento, setAddressComplemento] = useState("");

  const handleFinalize = () => {
    if (items.length === 0) return;

    if (!isCheckoutStep) {
      setIsCheckoutStep(true);
      return;
    }

    // Validation
    if (!paymentMethod) {
      alert("Por favor, selecione a forma de pagamento.");
      return;
    }
    if (!deliveryType) {
      alert("Por favor, selecione a forma de entrega.");
      return;
    }
    if (deliveryType === "delivery" && (!addressRua || !addressNumero || !addressBairro)) {
      alert("Por favor, preencha o endereço de entrega (Rua, Número e Bairro).");
      return;
    }

    const lines = items.map((item) => {
      let line = `*${item.quantity}x ${item.name}* - R$ ${(item.price * item.quantity).toFixed(2)}`;
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

    const paymentLabel = paymentMethod === 'pix' ? 'Pix' : paymentMethod === 'cartao' ? 'Cart\u00e3o' : 'Dinheiro';
    const deliveryLabel = deliveryType === 'delivery' ? 'Delivery' : 'Retirada no Local';

    // Build order payload and generate hash
    const orderPayload: OrderPayload = {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        additionals: item.additionals.map((a) => ({ name: a.name, price: a.price })),
        removals: item.removals,
        observation: item.observation,
      })),
      paymentMethod,
      deliveryType,
      address: deliveryType === 'delivery' ? {
        rua: addressRua,
        numero: addressNumero,
        bairro: addressBairro,
        complemento: addressComplemento || undefined,
      } : undefined,
      total: totalPrice,
      createdAt: new Date().toISOString(),
    };
    const orderHash = encodeOrder(orderPayload);

    let message = `Ol\u00e1! Gostaria de fazer um pedido:\n\n`;
    message += `*Meu Pedido:*\n${lines.join("\n\n")}\n\n`;
    message += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
    message += `*Pagamento:* ${paymentLabel}\n`;
    message += `*Entrega:* ${deliveryLabel}\n`;

    if (deliveryType === 'delivery') {
      message += `*Endere\u00e7o:* ${addressRua}, ${addressNumero}\n`;
      message += `*Bairro:* ${addressBairro}\n`;
      if (addressComplemento) {
        message += `*Complemento:* ${addressComplemento}\n`;
      }
    }

    message += `\n*Total: R$ ${totalPrice.toFixed(2)}*`;
    message += `\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n*C\u00f3digo do Pedido (para o atendente):*\n${orderHash}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5533999999959?text=${encoded}`, "_blank");

    clearCart();
    setIsCheckoutStep(false);
    setPaymentMethod("");
    setDeliveryType("");
    setAddressRua("");
    setAddressNumero("");
    setAddressBairro("");
    setAddressComplemento("");
    onClose();
  };

  const resetAndClose = () => {
    setIsCheckoutStep(false);
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
            onClick={resetAndClose}
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
                {isCheckoutStep ? (
                  <button onClick={() => setIsCheckoutStep(false)} className="p-1 -ml-1 hover:bg-secondary rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                ) : (
                  <ShoppingBag className="w-6 h-6 text-primary" />
                )}
                {isCheckoutStep ? "Checkout" : "Carrinho"}
              </h2>
              <button onClick={resetAndClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {!isCheckoutStep ? (
                // Cart Items View
                items.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Seu carrinho está vazio</p>
                    <p className="text-sm mt-1">Adicione itens do cardápio!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
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
                                className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-foreground">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-bold text-primary">R$ {itemTotal.toFixed(2)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : (
                // Checkout Form View
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <CreditCard className="w-5 h-5 text-primary" /> Forma de Pagamento
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'pix', icon: QrCode, label: 'Pix' },
                        { id: 'cartao', icon: CreditCard, label: 'Cartão' },
                        { id: 'dinheiro', icon: Banknote, label: 'Dinheiro' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === method.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                            }`}
                        >
                          <method.icon className="w-6 h-6 mb-1" />
                          <span className="text-xs font-bold">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Option */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <Truck className="w-5 h-5 text-primary" /> Forma de Entrega
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDeliveryType('delivery')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${deliveryType === 'delivery'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                          }`}
                      >
                        <Bike className="w-6 h-6 mb-1" />
                        <span className="text-sm font-bold">Delivery</span>
                      </button>
                      <button
                        onClick={() => setDeliveryType('retirada')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${deliveryType === 'retirada'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                          }`}
                      >
                        <Store className="w-6 h-6 mb-1" />
                        <span className="text-sm font-bold">Retirada</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Form (Conditional) */}
                  {deliveryType === 'delivery' && (
                    <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-300">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-foreground border-t border-border pt-4">
                        <MapPin className="w-5 h-5 text-primary" /> Endereço de Entrega
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3 space-y-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Rua</label>
                          <input
                            type="text"
                            value={addressRua}
                            onChange={(e) => setAddressRua(e.target.value)}
                            className="w-full bg-secondary border-none rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Nome da sua rua"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Nº</label>
                          <input
                            type="text"
                            value={addressNumero}
                            onChange={(e) => setAddressNumero(e.target.value)}
                            className="w-full bg-secondary border-none rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Bairro</label>
                        <input
                          type="text"
                          value={addressBairro}
                          onChange={(e) => setAddressBairro(e.target.value)}
                          className="w-full bg-secondary border-none rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none"
                          placeholder="Ex: Centro"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Complemento / Ref.</label>
                        <input
                          type="text"
                          value={addressComplemento}
                          onChange={(e) => setAddressComplemento(e.target.value)}
                          className="w-full bg-secondary border-none rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none"
                          placeholder="Apto, Casa, Ponto de ref..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4 bg-card">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinalize}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-display font-bold text-lg uppercase tracking-wider shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isCheckoutStep ? "Finalizar via WhatsApp" : "Continuar para Checkout"}
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
