import { existsSync } from 'fs';
import { log } from 'logger';

import { Constants } from '../constants';
import { createDownloader } from './create-downloader';

const download = createDownloader({
    name: 'ytdl',
    loadTo: Constants.YTDL_PATH,
    url: Constants.YTDL_URL,
});

export async function ensureYtdl() {
    if (existsSync(Constants.YTDL_PATH)) return;

    await download();

    log(`<grey>Downloaded ytdl</>`);
}
