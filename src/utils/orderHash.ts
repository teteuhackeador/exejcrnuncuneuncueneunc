// ─── Secret key (AES-GCM 256-bit) ────────────────────────────────────────────
// Change this value to invalidate all previously issued codes.
const SECRET_HEX = "4a8f3c1e2b7d9f0a6e4c5b3a1f8d2e7c4b9a0f3e6d1c5b8a7f2e4d9c3b6a1e0f";

// ─── Key caching ──────────────────────────────────────────────────────────────
let _cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
    if (_cachedKey) return _cachedKey;
    const bytes = new Uint8Array(
        SECRET_HEX.match(/.{2}/g)!.map((b) => parseInt(b, 16))
    );
    _cachedKey = await crypto.subtle.importKey(
        "raw",
        bytes,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
    return _cachedKey;
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Compact serialization ────────────────────────────────────────────────────
// Format: ts|payment|delivery|rua,numero,bairro,complemento|total|item1|item2...
// Item:   name~qty~price~addName+addPrice;...~removal;...~obs

const SEP = "|";
const ISEP = "~";
const ASEP = ";";

function serializeItem(item: OrderItemPayload): string {
    const adds = item.additionals
        .map((a) => `${a.name}+${a.price}`)
        .join(ASEP);
    return [
        item.name,
        item.quantity,
        item.unitPrice,
        adds,
        item.removals.join(ASEP),
        item.observation.replace(/\|/g, ""),
    ].join(ISEP);
}

function deserializeItem(s: string): OrderItemPayload {
    const [name, qty, price, adds, removals, obs] = s.split(ISEP);
    return {
        name,
        quantity: Number(qty),
        unitPrice: Number(price),
        additionals: adds
            ? adds.split(ASEP).map((a) => {
                const plus = a.lastIndexOf("+");
                return { name: a.slice(0, plus), price: Number(a.slice(plus + 1)) };
            })
            : [],
        removals: removals ? removals.split(ASEP).filter(Boolean) : [],
        observation: obs || "",
    };
}

function serialize(payload: OrderPayload): string {
    const addr = payload.address
        ? [
            payload.address.rua,
            payload.address.numero,
            payload.address.bairro,
            payload.address.complemento || "",
        ].join(",")
        : ",,,";
    const parts = [
        payload.createdAt,
        payload.paymentMethod,
        payload.deliveryType,
        addr,
        payload.total.toFixed(2),
        ...payload.items.map(serializeItem),
    ];
    return parts.join(SEP);
}

function deserialize(s: string): OrderPayload {
    const parts = s.split(SEP);
    const [createdAt, paymentMethod, deliveryType, addr, totalStr, ...itemParts] =
        parts;
    const [rua, numero, bairro, complemento] = addr.split(",");
    const hasAddress =
        deliveryType === "delivery" && (rua || numero || bairro);
    return {
        createdAt,
        paymentMethod,
        deliveryType,
        address: hasAddress
            ? { rua, numero, bairro, complemento: complemento || undefined }
            : undefined,
        total: Number(totalStr),
        items: itemParts.map(deserializeItem),
    };
}

// ─── Base64url helpers ────────────────────────────────────────────────────────
function toBase64url(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function fromBase64url(s: string): Uint8Array {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    return new Uint8Array(bin.split("").map((c) => c.charCodeAt(0)));
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Encrypts the order payload and returns an AES-GCM token (base64url).
 */
export async function encodeOrder(payload: OrderPayload): Promise<string> {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(serialize(payload));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
    // Prepend IV (12 bytes) to ciphertext
    const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipher), iv.byteLength);
    return toBase64url(combined.buffer);
}

/**
 * Decrypts a token and returns the OrderPayload, or null if invalid.
 */
export async function decodeOrder(token: string): Promise<OrderPayload | null> {
    try {
        const key = await getKey();
        const combined = fromBase64url(token);
        const iv = combined.slice(0, 12);
        const cipher = combined.slice(12);
        const plain = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            cipher
        );
        const text = new TextDecoder().decode(plain);
        return deserialize(text);
    } catch {
        return null;
    }
}

/**
 * Recomputes total from payload items for tamper detection.
 */
export function computeTotal(items: OrderItemPayload[]): number {
    return items.reduce((sum, item) => {
        const addPrice = item.additionals.reduce((s, a) => s + a.price, 0);
        return sum + (item.unitPrice + addPrice) * item.quantity;
    }, 0);
}
