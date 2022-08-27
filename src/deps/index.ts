import { ensureFfmpeg } from './ensure-ffmpeg';
import { ensureYtdl } from './ensure-ytdl';
import './replace-module';

export default async function ensureDeps() {
    await ensureFfmpeg();
    await ensureYtdl();
}
