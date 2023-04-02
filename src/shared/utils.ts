export function parseQuery(qs?: string): Record<string, string>{
    qs = qs ?? location.search;
    if (qs.startsWith('?')) qs = qs.substring(1);
    const result: Record<string, string> = {};
    qs.split('&').forEach(pair => {
        const [key, value] = pair.split('=', 2);
        result[key] = value;
    })
    return result;
}

export function asHexByte(n: number): string {
    return n.toString(16).padStart(2, '0');
}

export function generateID(type: number, length?: number): string {
    length = length ?? 6;
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return asHexByte(type) + asHexByte(length) + Array.from(array).map(asHexByte).join('');
}

export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}