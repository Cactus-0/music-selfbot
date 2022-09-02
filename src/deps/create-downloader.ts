import fs from 'fs';
import os from 'os';
import axios from 'axios';

import { log } from 'logger';
import { MultiBar } from 'cli-progress';
import internal from 'stream';


interface ICreateDownloaderOptions {
    name: string;
    url: string;
    loadTo: string;
}

export const createDownloader = ({ loadTo, name, url }: ICreateDownloaderOptions) => async (multiBar: MultiBar) => {
    log(`<grey>Downloading ${name}...</>`);

    const platform = `${os.platform()}-${os.arch()}`;

    try {
        const {
            data: stream,
            headers: { ['content-length']: total }
        } = await axios.get<internal.Readable>(url, { responseType: 'stream' });

        const writeStream = fs.createWriteStream(loadTo, { mode: 0o755 });

        const bar = multiBar.create(+total, 0, { msg: name.padEnd(10) });

        await new Promise<void>((resolve, reject) => {
            let resolved = false;

            const success = () => {
                if (resolved) return;
                
                resolved = true;

                bar.stop();
                resolve();
            }

            stream
                .on('data', (data: Buffer) => bar.increment(data.byteLength))
                .pipe(writeStream)
                .on('finish', success)
                .on('close', success)
                .on('error', reject);
        });

        
    } catch (error) {
        if (!axios.isAxiosError(error))
            throw error;

        if (error.response?.status === 404)
            log(`There is no any pre-builds of ${loadTo} found for <grey>${platform}</>`);

        process.exit(1);
    }
}