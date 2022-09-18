import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'skip',
    description: 'skip one or more tracks',
    
    args: [
        {
            name: 'count',
            optional: true,
            type: 'number'
        }
    ],

    exec: ({ queue: query, args: [_count = '1'] }) => {
        const count = +_count;
        
        if (count < 1) return;

        query.skip(count);
    }
}
