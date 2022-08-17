import path from 'path';
import os from 'os';

type IPlatformDict<T> = {
    [K in NodeJS.Platform]?: T;
} & ({
    default: NodeJS.Platform;
} | {
    defaultValue: T;
});

function platform<T>(obj: IPlatformDict<T>): T {
    if (process.platform in obj)
        return obj[process.platform]!;

    if ('default' in obj)
        return obj[obj.default]!;
    
    return obj.defaultValue;
}

export namespace Constants {
    export const DATA_DIR = platform({
        win32: path.join(process.env.PROGRAMDATA ?? 'C:/ProgramData', 'cactus-music-selfbot'),
        linux: path.join(os.homedir(), './.config/cactus-music-selfbot'),
        default: 'linux'
    });

    export const CONFIG_FILE_PATH = path.join(DATA_DIR, 'config.json');
}
