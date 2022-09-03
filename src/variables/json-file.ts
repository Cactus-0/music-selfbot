import { args } from 'args';
import fs from 'fs';
import { VariablesEvents } from './events';

const wrap = <T extends object>(o: T) => new Proxy(o, {
    set(target, p, value) {        
        // @ts-expect-error
        target[p] = value;

        // @ts-expect-error
        VariablesEvents.emit(`change:${p}`, value);

        return true;
    },
});

export default class JSONFile<T extends Record<string, string | undefined>> {
    public readonly data: T = wrap<T>(Object.create(null));

    constructor(
        private readonly _path: string
    ) { }

    public load(): void {
        if (args.noLoad) return;
        if (!fs.existsSync(this._path)) return;
        
        Object.assign(
            this.data,
            JSON.parse(fs.readFileSync(this._path, { encoding: 'utf-8' }) || '{}')
        );
    }

    public save(): void {
        if (args.noSave) return;
        fs.writeFileSync(this._path, JSON.stringify(this.data), { encoding: 'utf-8' });
    }
}
