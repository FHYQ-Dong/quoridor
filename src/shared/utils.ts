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