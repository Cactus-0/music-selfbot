import './setup';

import { CommandReader, MusicBot } from 'bot';
import { input, log } from 'logger';
import { getVariable, configFile } from 'variables';
import ensureDeps from 'deps';
import { autoupdater } from 'autoupdater';
import { args } from 'args';

Object.prototype.toString = function () {
	return JSON.stringify(this);
};

export async function main() {
	await autoupdater();

	await ensureDeps();

	const bot = new MusicBot();

	let token = args.token || await getVariable('token'),
		first = token;
	let startLoginTime: number;

	while (true) {
		try {
			startLoginTime = Date.now();
			log(`<gray>Logging in...</>`);
			await bot.login(token);
			break;
		} catch (error: any) {
			log(`[<rad>${error.name}</>]: ${error.message}`);

			token = await input('Provide another token: ');

			configFile.data.token = token;
		}
	}

	if (token !== first) {
		configFile.save();
		log(
			'The token was saved. You can change it using <bgGrey>set token {new token}</> and restarting the program, when bot will be ready.'
		);
	}

	bot.client.on('error', console.error);

	await bot.waitForReady();

	log(
		`\n(${((Date.now() - startLoginTime) / 1000).toFixed(1)}s) ` +
			`Logged in as <cyan>${bot.client.user?.tag}</>. You can type here commands for bot. Type <green>"help"</> for help`
	);

	if (args.noSave)
		log(`<bgYellow> ! </> Config file will be not saved`);

	if (args.noLoad)
		log(`<bgYellow> ! </> Config was not loaded`);

	new CommandReader(bot.client)
		.on('command', (input) => bot.executeCommand(input))
		.start();
}

main();

process.on('uncaughtException', console.error);
