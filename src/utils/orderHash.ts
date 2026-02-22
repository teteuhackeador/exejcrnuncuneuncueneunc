export interface OrderItemPayload {
    name: string;
    quantity: number;
    unitPrice: number;
    additionals: { name: string; price: number }[];
    removals: string[];
    observation: string;
}

export interface OrderPayload {
    items: OrderItemPayload[];
    paymentMethod: string;
    deliveryType: string;
    address?: {
        rua: string;
        numero: string;
        bairro: string;
        complemento?: string;
    };
    total: number;
    createdAt: string;
}

/**
 * Encodes the order payload into a URL-safe base64 string.
 */
export function encodeOrder(payload: OrderPayload): string {
    const json = JSON.stringify(payload);
    // btoa works with Latin-1; we use encodeURIComponent to handle UTF-8
    const base64 = btoa(unescape(encodeURIComponent(json)));
    // Make URL-safe
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes a hash string back into an OrderPayload.
 * Returns null if the hash is invalid or malformed.
 */
export function decodeOrder(hash: string): OrderPayload | null {
    try {
        // Restore standard base64
        const base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(escape(atob(base64)));
        const payload = JSON.parse(json) as OrderPayload;
        // Basic validation
        if (!payload.items || !Array.isArray(payload.items)) return null;
        if (typeof payload.total !== "number") return null;
        return payload;
    } catch {
        return null;
    }
}

/**
 * Computes the total from the payload items (for tamper detection).
 */
export function computeTotal(items: OrderItemPayload[]): number {
    return items.reduce((sum, item) => {
        const addPrice = item.additionals.reduce((s, a) => s + a.price, 0);
        return sum + (item.unitPrice + addPrice) * item.quantity;
    }, 0);
}
