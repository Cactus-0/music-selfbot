import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'join',
    description: 'join a voice channel',

    args: [
        {
            name: 'channel-id',
            type: {
                test: raw => /^\d+$/.test(raw),
                errorMessage: (arg, i) => `argument ${i+1} (${arg}) must be an valid id`
            }
        }
    ],

    exec: async ({ args: [id], bot, log, logTarget }) => {
        const channel = await bot.joinChannel(id);

        if (logTarget === 'console')
            log(`[<grey>Join</>] 🔊 ${channel.name}`)
        else
            await log(`I joined \`${channel.name}\``)
    }
}
