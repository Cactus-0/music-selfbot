import type { Track } from 'music';
import type { log } from 'logger';
import type * as variables from 'variables';

import type { MusicBot } from './music-bot';
import type { Queue } from '../music/queue';
import type { LogTarget } from 'logger/log-target';


export interface IExecutionEnvironment {
    args: string[];
    queue: Queue;
    bot: MusicBot;
    log: (message: string) => Promise<void> | void;
    logTarget: LogTarget
    vars: typeof variables;
    Track: typeof Track;
    commands: Map<string, ICommand>;
}

export interface IArgument {
    name: string;

    /** @default {string} */
    type?: 'string' | 'number' | {
        test: (raw: string) => boolean;
        errorMessage?: (value: string, index: number) => string;
    };
    
    /** @default {false} */
    optional?: boolean;
}

export interface ICommand {
    name: string;
    description: string;
    args: IArgument[];
    exec: (args: IExecutionEnvironment) => void | Promise<void>;
}
