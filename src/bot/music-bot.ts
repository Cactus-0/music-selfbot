import Discord from 'discord.ts-selfbot';

import * as vars from 'variables';
import { log, textFormat } from 'logger';
import { commands } from './commands';
import { execCommand } from './exec-command';
import { Queue } from './queue';
import { Track } from 'music';
import type { IExecutionEnvironment } from './command';
import { WithLogger } from 'logger/with-logger';
import autobind from 'autobind-decorator';

export class MusicBot extends WithLogger {
    public client = new Discord.Client;

    private connection: Discord.VoiceConnection | null = null;
    private queue = new Queue;

    private end: any = (f: () => void, _onskip: () => void) => () => {
        f();
        this.queue.off('skip', _onskip);
    }

    constructor() {
        super();

        this.queue.on('play', () => {
            this.play();
        });
    }

    public async login(token: string) {
        await this.client.login(token);
    }

    public waitForReady() {
        return new Promise<void>(resolve => this.client.once('ready', resolve))
    }

    public async joinChannel(id: string) {
        const channel = <Discord.VoiceChannel>this.client.channels.cache.get(id);

        if (channel.type !== 'voice') {
            throw new Error(`${channel?.name} is not a voice channel`);
        }

        this.connection = await channel.join();

        return channel;
    }

    public async play() {
        while (true) {
            try {
                const track = await this.queue.getSong();

                await this.log(
                    this.logTarget === 'console'
                        ? `[<gray>Queue</>] Current song: <cyan>${track.title}</> from <cyan>${track.author}</>`
                        : `Current song: **\`${track.title}\`** from **\`${track.author}\`**`
                );

                await new Promise<void>(async (resolve, reject) => {
                    const onskip = () => {
                        dispatcher.destroy();
                        resolve();
                    }

                    const dispatcher = this.connection?.play(await track.stream())
                        .on('finish', this.end(resolve, onskip))
                        .on('close', this.end(resolve, onskip))
                        .on('error', this.end(reject, onskip))!;

                    this.queue.once('skip', onskip);

                    dispatcher.on('start', () =>
                        this.log(
                            this.logTarget === 'console'
                                ? `[<gray>Playing</>] <cyan>${track.title}</> from <grey>${track.author}</>`
                                : `**Playing**: **\`${track.title}\`** from **\`${track.author}\`**`
                        )
                    );
                });

                this.queue.next();
            } catch (error: any) {
                console.error(error);
                console.error(textFormat(
                    `[<red>Error</>]:` + (
                        error instanceof Error
                            ? `\n\t${error?.name}: ${error?.message}`
                            : `${error}`
                    )
                ));
            }
        }
    }

    @autobind
    public async executeCommand(input: string) {
        const [ commandName, ...args ] = input.split(/\s+/g);

        const command = commands.get(commandName);

        if (!command) return;

        try {
            await execCommand({
                command,
                context: this.createCommandContext(args),
            });
        } catch (error: any) {
            if (this.logTarget === 'console')
                this.log(`[<red>${error.name}</>]: ${error.message}`);
            else
                await this.log(`[\`${error.name}\`]: ${error.message}`);
        }
    }

    private createCommandContext(args: string[],): IExecutionEnvironment {
        return {
            Track,
            vars,
            args,
            commands,
            bot: this,
            queue: this.queue,
            log: this.log,
            logTarget: this.logTarget!
        };
    }

    public destroy() {
        if (this.connection)
            this.connection.channel.leave();
        
        log(`[<gray>Client</>] ${this.client.user?.username} destroyed`);

        this.client.destroy();
    }
}
