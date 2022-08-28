import type { ICommand } from 'bot/command';
import { isURL } from 'utils/is-url';

export const command: ICommand = {
    name: 'play',
    description: 'play video from youtube',

    args: [
        {
            name: 'url or name'
        }
    ],

    exec: async ({ args: urlOrName, queue, Track, log, logTarget }) => {
        let query = urlOrName.join(' ');

        if (isURL(query) && query.includes('open.spotify.com'))
            query = query.slice(0, query.indexOf('?'))

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
