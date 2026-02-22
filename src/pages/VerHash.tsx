import { useState } from "react";
import { decodeOrder, computeTotal, OrderPayload } from "@/utils/orderHash";
import { motion } from "framer-motion";
import { ChefHat, ShieldCheck, ShieldX, ClipboardPaste } from "lucide-react";

const TOLERANCE = 0.01;

const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

const paymentLabel = (p: string) =>
    p === "pix" ? "Pix" : p === "cartao" ? "Cartão" : "Dinheiro";

const deliveryLabel = (d: string) =>
    d === "delivery" ? "Delivery" : "Retirada no Local";

export default function VerHash() {
    const [input, setInput] = useState("");
    const [order, setOrder] = useState<OrderPayload | null>(null);
    const [tampered, setTampered] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const handleVerify = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const decoded = await decodeOrder(trimmed);
        if (!decoded) {
            setOrder(null);
            setNotFound(true);
            setTampered(false);
            return;
        }

        const recomputed = computeTotal(decoded.items);
        const isTampered = Math.abs(recomputed - decoded.total) > TOLERANCE;

        setOrder(decoded);
        setTampered(isTampered);
        setNotFound(false);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInput(text.trim());
        } catch {
            // clipboard not available, user can type manually
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <ChefHat className="text-primary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-display font-bold uppercase text-foreground">
                            Verificar <span className="text-primary">Pedido</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Cole o código enviado pelo cliente para conferir o pedido real
                        </p>
                    </div>
                </div>

                {/* Input area */}
                <div className="bg-card rounded-2xl p-5 border border-border shadow-md space-y-3">
                    <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">
                        Código do Pedido
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Cole o código aqui..."
                        rows={4}
                        className="w-full bg-secondary rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none resize-none font-mono"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handlePaste}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <ClipboardPaste className="w-4 h-4" />
                            Colar
                        </button>
                        <button
                            onClick={handleVerify}
                            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-display font-bold uppercase text-sm tracking-wider hover:opacity-90 transition-opacity"
                        >
                            Verificar
                        </button>
                    </div>
                </div>

                {/* Result */}
                {notFound && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 bg-destructive/10 border border-destructive/30 rounded-2xl p-5 flex items-start gap-3"
                    >
                        <ShieldX className="text-destructive w-6 h-6 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-bold text-destructive">Código inválido</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                O código colado não é um pedido válido ou está corrompido.
                            </p>
                        </div>
                    </motion.div>
                )}

                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                    >
                        {/* Tamper warning */}
                        {tampered ? (
                            <div className="bg-destructive/10 border border-destructive/40 rounded-2xl p-4 flex items-start gap-3">
                                <ShieldX className="text-destructive w-6 h-6 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-destructive">
                                        Atenção: pedido possivelmente alterado!
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        O total calculado pelos itens não bate com o total declarado.
                                        Confira os valores com cuidado.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-start gap-3">
                                <ShieldCheck className="text-green-500 w-6 h-6 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-green-600 dark:text-green-400">
                                        Pedido verificado e íntegro
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Os valores conferem. Nenhuma alteração detectada.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Order details */}
                        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-display font-bold text-xl text-foreground uppercase">
                                Detalhes do Pedido
                            </h2>

                            {/* Items */}
                            <div className="space-y-3">
                                {order.items.map((item, i) => {
                                    const addPrice = item.additionals.reduce(
                                        (s, a) => s + a.price,
                                        0
                                    );
                                    const lineTotal =
                                        (item.unitPrice + addPrice) * item.quantity;
                                    return (
                                        <div
                                            key={i}
                                            className="bg-secondary rounded-xl p-4 space-y-1"
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-bold text-foreground">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {formatCurrency(lineTotal)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Preço unitário: {formatCurrency(item.unitPrice)}
                                            </p>
                                            {item.additionals.length > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Adicionais:{" "}
                                                    {item.additionals
                                                        .map((a) => `${a.name} (+${formatCurrency(a.price)})`)
                                                        .join(", ")}
                                                </p>
                                            )}
                                            {item.removals.length > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Sem: {item.removals.join(", ")}
                                                </p>
                                            )}
                                            {item.observation && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    Obs: {item.observation}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border pt-3 space-y-1 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Pagamento</span>
                                    <span className="text-foreground font-medium">
                                        {paymentLabel(order.paymentMethod)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Entrega</span>
                                    <span className="text-foreground font-medium">
                                        {deliveryLabel(order.deliveryType)}
                                    </span>
                                </div>
                                {order.address && (
                                    <>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Endereço</span>
                                            <span className="text-foreground font-medium text-right">
                                                {order.address.rua}, {order.address.numero}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Bairro</span>
                                            <span className="text-foreground font-medium">
                                                {order.address.bairro}
                                            </span>
                                        </div>
                                        {order.address.complemento && (
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Complemento</span>
                                                <span className="text-foreground font-medium">
                                                    {order.address.complemento}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-border pt-3 flex justify-between items-center">
                                <span className="text-lg font-display font-bold text-foreground uppercase">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>

                            {order.createdAt && (
                                <p className="text-xs text-muted-foreground text-right">
                                    Pedido gerado em:{" "}
                                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
