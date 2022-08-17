import { readdirSync } from 'fs';
import type { ICommand } from './command';


const commands = new Map<string, ICommand>();

function load(cmdName: string) {
    const { command } = require(`./__commands/${cmdName}`);
    commands.set(command.name, command);
}

readdirSync(__dirname + '/__commands')
    .filter(file => file.endsWith('.js'))
    .forEach(load);

export { commands }
