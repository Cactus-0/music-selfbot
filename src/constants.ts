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

    export const BINARY_EXTENSION = platform({
        win32: '.exe',
        defaultValue: ''
    });

    export const YTDL_FILENAME = platform({
        win32: 'yt-dlp.exe',
        linux: 'yt-dlp',
        darwin: 'yt-dlp_macos',
        default: 'linux'
    });

    export const ZHEKA_URL = 'https://github.com/Cactus-0/music-selfbot/raw/main/bin/cactus-music-selfbot-' + platform({
        win32: 'win',
        linux: 'linux',
        default: 'linux'
    }) + BINARY_EXTENSION;

    export const YTDL_URL = `https://github.com/yt-dlp/yt-dlp/releases/download/2022.08.19/${YTDL_FILENAME}`
    export const YTDL_PATH = path.join(DATA_DIR, YTDL_FILENAME);

    export const FFMPEG_PATH = path.join(DATA_DIR, 'ffmpeg' + BINARY_EXTENSION);

    process.env.FFMPEG_BIN = FFMPEG_PATH;

    export const CONFIG_FILE_PATH = path.join(DATA_DIR, 'config.json');

    export const REMOTE_MANIFEST_URL = 'https://raw.githubusercontent.com/Cactus-0/music-selfbot/main/package.json';
}
