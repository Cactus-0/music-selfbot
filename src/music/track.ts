import axios from 'axios';
import internal from 'stream';
import { isURL } from 'utils/is-url';
import youtubeDlExec from 'youtube-dl-exec';
import { getInfoByUrl, getInfoByName } from './get-info';

export interface ITrack {
    title: string | null;
    author: string | null;
    url: string;
    readonly lazyFetchInfo?: boolean;
}


export class Track implements ITrack {
    public readonly title: string | null = null;
    public readonly author: string | null = null;
    public readonly url!: string;
    public readonly lazyFetchInfo: boolean = false;
    private _fetched: boolean = false;

    public static async create(urlOrName: string, lazyFetchInfo: boolean = false): Promise<Track> {
        let trackData: ITrack = isURL(urlOrName)
            ? await getInfoByUrl(urlOrName)
            : await getInfoByName(urlOrName);

        const instance = new this(trackData);
        instance._fetched = !lazyFetchInfo;

        return instance;
    }

    public constructor(trackData: ITrack) {
        Object.assign(this, trackData);
    }

    public toString() {
        return `${this.title} - ${this.author}`;
    }

    public async stream(): Promise<internal.Readable> {
        const { url: videoUrl } = await youtubeDlExec(this.url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            format: 'bestaudio/best',
            referer: this.url
        });

        const { data: videoStream } = await axios.get(videoUrl, { responseType: 'stream' });

        return videoStream;
    }
}