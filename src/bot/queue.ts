import EventEmitter from 'event-emitter';
import type { Track } from 'music';

export class Queue extends EventEmitter<{
    skip: () => void;
    new: (song: Track) => void;
    play: () => void;
}> {
    private trackList: Track[] = [];
    private current: number = 0;

    public get index(): number {
        return this.current;
    }

    public add(...songs: Track[]): this {
        const isEmpty = this.trackList.length === 0;

        this.trackList.push(...songs);

        this.emit('new', songs[0]);

        if (songs.length > 0 && isEmpty)
            this.emit('play');

        return this;
    }

    public next(): Track | null {
        return this.trackList[++this.current] ?? null;
    }

    public getCurrent(): Track | null {
        return this.trackList[this.current] ?? null;
    }

    public skip(): this {
        this.emit('skip');
        return this;
    }

    public getSong(): Promise<Track> {
        let song = this.getCurrent();

        if (song) return Promise.resolve(song);

        return new Promise<Track>(resolve => {
            this.once('new', resolve);
        });
    }

    public get list() {
        return [...this.trackList];
    }
}
