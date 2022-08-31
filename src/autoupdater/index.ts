import fs from 'fs';
import { input, log } from 'logger';
import path from 'path';
import { versions } from 'utils/versions';
import { updateSelf } from './update-self';

export async function autoupdater() {
	const oldVersionPath = path.resolve(process.argv[0], '../.old-zheka');

	if (fs.existsSync(oldVersionPath)) {
		fs.rmSync(oldVersionPath);
	}

	log(`<grey>Checking updates...</>`);

	const { current, installed, availableNewVersion } = await versions();

	if (!availableNewVersion) return;

	log(`There is available a new version.`);

	const answer = await input(
		`Do you want to upgrade from <grey>v${installed}</> to <yellow>v${current}</> (y/n)? `
	);

	if (answer.toLowerCase() !== 'y') return;

	if (process.isDev) return;

	const file = await updateSelf();
	const relPath = path.relative(process.cwd(), file);

	log(
		`Successfully installed new version. Launch it using <bgWhite>${relPath}</>. Old version will be automatically deleted.`
	);

	await input('Press <bgWhite>Enter</> to continue. ');

	process.exit(0);
}
