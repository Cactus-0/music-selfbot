import type { ICommand } from 'bot/command';

const showPrevious = 2;

export const command: ICommand = {
    name: 'queue',

    args: [],

    description: 'shows current queue',

    exec: async ({ queue, log, logTarget }) => {
        const bottomBorder = queue.index < showPrevious ? queue.index : queue.index - showPrevious;
        const list = queue.list.slice(bottomBorder, queue.index + 15);

        if (queue.index >= queue.list.length) {
            log(
                logTarget === 'console'
                    ? `<gray>No one songs left in queue. Add a song using "play ;slurl or search query;sr".</>`
                    : 'No one songs left in queue. Add a song using **`play <url or search query>`**.'
            );
            return;
        }

        if (logTarget === 'console') {
            log(`\n - Current queue:\n`);

            list.forEach((track, index) => {
                log(
                    (bottomBorder + index === queue.index ? '<gray>;sr</> ' : '')
                    + `${queue.index + index + 1}. <cyan>${track}</>`
                );
            });

            log('');
        } else {
            await log(
                '```\n      - Current queue\n```\n'
                + list
                    .map((track, index) =>
                        (bottomBorder + index === queue.index ? '**>** ' : '')
                        + `**${queue.index + index + 1}.** **\`${track}\`**`
                    )
                    .join('\n')
            )
        }
    }
}
