import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';

declare class TypedEventEmitter<T extends {} = {}> extends (EventEmitter as { new<T extends {}>(): TypedEmitter<T> })<T> {}

export default EventEmitter as typeof TypedEventEmitter;
