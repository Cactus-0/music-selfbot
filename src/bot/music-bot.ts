import Discord from 'discord.js-selfbot-v13';
import * as DiscordV from '@discordjs/voice';

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
    public client = new Discord.Client({ checkUpdate: false });

    private connection: DiscordV.VoiceConnection | null = null;
    private queue = new Queue;
    private player = DiscordV.createAudioPlayer();

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
        return new Promise<void>(resolve => this.client.once('ready', () => resolve()))
    }

    public async joinChannel(id: string) {
        const channel =
            this.client.channels.cache.get(id) ||
            await this.client.channels.fetch(id);

        if (!channel?.isVoice?.())
            // @ts-expect-error
            throw new Error(`${channel?.name} is not a voice channel`);

        this.connection = DiscordV.joinVoiceChannel({
            // @ts-expect-error
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guildId,
        });

        return channel;
    }

    public async play() {
        this.connection?.subscribe(this.player);

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
                        stream.destroy();
                        resolve();
                    }

                    const [stream, audioResource] = await track.toAudioResource();

                    this.player.play(audioResource);

                    stream
                        .on('end', this.end(resolve, onskip))
                        .on('close', this.end(resolve, onskip))
                        .on('error', this.end(reject, onskip))!;

                    this.queue.once('skip', onskip);
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
        this.player.stop(true);

        this.client.destroy();

        log(`[<gray>Client</>] ${this.client.user?.username} destroyed`);
    }
}
