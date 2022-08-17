import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'help',
    description: 'show this list',

    args: [],

    exec: async ({ commands, log, logTarget }) => {
        const names: string[] = [];
        const commandArgs: string[] = [];

        for (const [name, command] of commands.entries()) {
            const args = command.args.map(arg => {
                let h = arg.optional ? '[]' : '<>';

                return h[0] + arg.name + h[1];
            }).join(' ');

            commandArgs.push(args);
            names.push(name);
        }

        const maxLength = Math.max(...names.map((name, i) => name.length + commandArgs[i].length));

        if (logTarget === 'console') {
            log('\n - List of commands:\n');

            names.forEach((name, i) => {
                log(`<yellow>${name}</> ${commandArgs[i]}`.padEnd(maxLength + 18, ' ') + ' <gray>|</> ' + commands.get(name)?.description);
            });

            log('')
        } else {
            const cmd = names.map((name, i) =>
                `**${i + 1}**. \`${name}`
                    + (commandArgs[i].length > 0 ? ` ${commandArgs[i]}` : '')
                    + '\`'
                    + ' - '
                    + commands.get(name)?.description
            ).join('\n');

            log('```\n      - List of my commands:\n```\n' + cmd + '\n\n**`<p> - required | [p] - optional`**');
        }
    }
}
