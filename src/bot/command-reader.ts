import autobind from "autobind-decorator";
import Discord from "discord.js-selfbot-v13";
import { createInterface } from 'readline';

import { getLogTarget, LogTarget } from "logger/log-target";
import { VariablesEvents } from "variables/events";
import { configFile } from "variables";
import EventEmitter from "event-emitter";

export class CommandReader extends EventEmitter<{
    command(input: string, message?: Discord.Message): void
}> {
    private logTarget!: LogTarget;
    private readonly stdinReader = createInterface(process.stdin);
    
    constructor(
        private readonly client: Discord.Client
    ) {
        super();
    }

    @autobind
    private _stdinCallback(message: string): void {
        this.emit('command', message);
    }

    @autobind
    private _messageCallback(message: Discord.Message | Discord.PartialMessage): void {
        const { prefix } = configFile.data;
        
        if (message.channel.id !== (<Discord.TextChannel>this.logTarget).id) return;

        if (prefix && !message.content?.startsWith(prefix))
            return;

        this.emit('command', message.content?.slice(prefix?.length ?? 0)!);
    }

    @autobind
    private async _newLogTarget() {
        this.logTarget = await getLogTarget(this.client);

        this.client.off('messageCreate', this._messageCallback);

        if (this.logTarget !== 'console')
            this.client.on('messageCreate', this._messageCallback);
    }

    public start() {
        this._newLogTarget();

        this.stdinReader.on('line', this._stdinCallback);
        VariablesEvents.on('change:logTo', this._newLogTarget);
    }

    public stop() {
        VariablesEvents.off('change:logTo', this._newLogTarget);
        this.client.off('messageCreate', this._messageCallback);
        this.stdinReader.off('line', this._stdinCallback);
    }
}
