import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'exit',
    description: 'leave current voice channel and exit from program',

    args: [],

    exec: ({ bot }) => {
        bot.destroy();
        process.exit(0);
    }
}
