import './replace-module';

import { MultiBar } from 'cli-progress';
import { ensureFfmpeg } from './ensure-ffmpeg';
import { ensureYtdl } from './ensure-ytdl';
import { progressBarPreset } from './progress-bar-preset';


export default async function ensureDeps() {
    const progressBar = new MultiBar({
        hideCursor: true
    }, progressBarPreset);

    await Promise.all([
        ensureFfmpeg(progressBar),
        ensureYtdl(progressBar)
    ]);

    progressBar.stop();
}
