import fs from 'fs';
import os from 'os';
import axios from 'axios';
import fetch from 'node-fetch';

import { log } from 'logger';


interface ICreateDownloaderOptions {
    name: string;
    url: string;
    loadTo: string;
}

export const createDownloader = ({ loadTo, name, url }: ICreateDownloaderOptions) => async () => {
    log(`<grey>Downloading ${name}...</>`);

    const platform = `${os.platform()}-${os.arch()}`;

    try {
        const buffer = await fetch(url).then(res => res.buffer());

        fs.writeFileSync(loadTo, buffer, { mode: 0o755 });
    } catch (error) {
        if (!axios.isAxiosError(error))
            throw error;

        if (error.response?.status === 404)
            log(`There is no any pre-builds of ${loadTo} found for <grey>${platform}</>`);

        process.exit(1);
    }
}