import axios from 'axios';
import { Constants } from '../constants';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import internal from 'stream';

export async function updateSelf(): Promise<string> {
	const argv0 = process.argv[0];

	const oldFileName = path.resolve(argv0, '..', '.old-zheka');

	await fs.rename(argv0, oldFileName);

	const { data: stream } = await axios.get<internal.Readable>(
		Constants.ZHEKA_URL,
		{ responseType: 'stream' }
	);

	await new Promise((resolve, reject) =>
		stream
			.pipe(createWriteStream(argv0, { mode: 0o755 }))
			.once('error', reject)
			.once('finish', resolve)
			.once('close', resolve)
	);

	return argv0;
}
