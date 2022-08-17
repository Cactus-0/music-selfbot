export function set(...values: string[]): Set<any> {
    return new Proxy(new Set(values), {
        has: (target, key) => target.has(key.toString())
    });
}

export namespace set {
    export function not(...values: string[]): Set<any> {
        return new Proxy(new Set(values), {
            has: (target, key) => !target.has(key.toString())
        });
    }
}
