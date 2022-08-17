import { IConfig } from 'config';
import EventEmitter from 'event-emitter';

type IEvents = {
    [EventName in `change:${keyof IConfig}`]: (newValue: string) => void;
}

export const VariablesEvents = new EventEmitter<IEvents>();
