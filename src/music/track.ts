import { AudioResource, createAudioResource } from '@discordjs/voice';
import axios from 'axios';
import internal from 'stream';
import { create } from 'youtube-dl-exec';

import { Constants } from '../constants';
import { getInfo } from './get-info';
import type { ITrack } from './types';
import { ytdlFlags } from './constants';

const ytdl = create(Constants.YTDL_PATH);

export class Track {
    public readonly title?: string;
    public readonly author?: string;
    public readonly url?: string;
    public readonly lazyFetchInfo: boolean = false;
    private _fetchData?: string;
    private _fetched: boolean = false;

    public static async create(urlOrName: string, lazyFetchInfo: boolean = false): Promise<Track | Track[]> {
        if (lazyFetchInfo) {
            // @ts-expect-error
            const instance = new this({
                lazyFetchInfo: true,
                _fetchData: urlOrName
            });

            instance._fetched = false;

            return instance;
        }
        
        const info = await getInfo(urlOrName);

        if (Array.isArray(info))
            return info.map(track => new this(track));

        return new this(info);
    }

    public constructor(trackData: ITrack) {
        Object.assign(this, trackData);

        if (!this._fetchData)
            this._fetched = true;
    }

    public toString() {
        return this._fetched
            ? `${this.title} - ${this.author}`
            : this._fetchData;
    }

    private async fetchInfo(): Promise<void> {
        const info = await getInfo(this._fetchData!);

        if (Array.isArray(info))
            throw new Error('can not lazy fetch playlist');

        Object.assign(this, info);

        this._fetched = true;
    }
    
    public async stream(): Promise<internal.Readable> {
        if (!this._fetched)
            await this.fetchInfo();

        const { url: videoUrl } = await ytdl(this.url!, ytdlFlags(this.url!));

        const { data: videoStream } = await axios.get(videoUrl, { responseType: 'stream' });

        return videoStream;
    }

    public async toAudioResource(): Promise<[ internal.Readable, AudioResource ]> {
        const stream = await this.stream();
        return [ stream, createAudioResource(stream) ];
    }
}
