import autobind from "autobind-decorator";
import { Client, Message } from "discord.js-selfbot-v13";
import { log, textFormat } from ".";
import { getLogTarget, LogTarget } from "./log-target";

export abstract class WithLogger {
    protected abstract readonly client: Client;
    
    protected logTarget?: LogTarget;

    @autobind
    protected async log(text: string): Promise<void> {
        this.logTarget = await getLogTarget(this.client);

        if (this.logTarget === 'console')
            return void log(text);
        
        await this.logTarget.send(text) as any;
    }
}
