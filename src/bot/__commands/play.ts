import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'play',
    description: 'play video from youtube',

    args: [
        {
            name: 'url or name'
        }
    ],

    exec: async ({ args: urlOrName, queue, Track, log, logTarget }) => {
        const query = urlOrName.join(' ');

        await log(
            logTarget === 'console'
                ? `Fetching information about <gray>${query}</>...`
                : `Fetching information about **\`${query}\`**...`
        );
        
        const track = await Track.create(query);
        
        await log(
            logTarget === 'console'
                ? `[<gray>Queue</>] added <cyan>${track.title}</> from <gray>${track.author}</>`
                : `Added **\`${track.title}\`** from **\`${track.author}\`** to queue.`
        );

        queue.add(track);
    }
}
