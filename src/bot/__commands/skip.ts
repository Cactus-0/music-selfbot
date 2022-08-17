import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'skip',
    description: 'skip current song',
    args: [],
    exec: ({ queue: query }) => {
        query.skip();
    }
}
