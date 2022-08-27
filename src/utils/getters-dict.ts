type In = Record<string, () => any>;
type Out<T extends In> = { [K in keyof T]: ReturnType<T[K]> }

export function createGettersDict<T extends In, U = {}>(o: T, target?: U): Out<T> & U {
    target ??= Object.create(null);

    Object.entries(o).forEach(([ key, get ]) => {
        Object.defineProperty(target, key, { get });
    });

    return <Out<T> & U>target;
}
