import fs from 'fs';
import os from 'os';
import { Constants } from "../constants";
import { log } from 'logger';
import { createDownloader } from './create-downloader';
import { MultiBar } from 'cli-progress';


export async function ensureFfmpeg(multiBar: MultiBar): pvoid {
    if (fs.existsSync(Constants.FFMPEG_PATH)) return;

    const platform = `${os.platform()}-${os.arch()}`;

    await createDownloader({
        name: 'ffmpeg',
        loadTo: Constants.FFMPEG_PATH,
        url: `https://github.com/eugeneware/ffmpeg-static/releases/download/b5.0/${platform}`,
    })(multiBar);
}
