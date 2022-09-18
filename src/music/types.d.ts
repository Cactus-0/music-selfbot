export interface IFullTrackData {
    title: string;
    author: string;
    url: string;
    readonly lazyFetchInfo: false;
}

export interface ILazyTrackData {
    title: undefined;
    author: undefined;
    url: undefined;
    readonly _fetchData: string;
    readonly lazyFetchInfo: true;
}

export type ITrack = {
    title: string;
    author: string;
    url: string;
    readonly lazyFetchInfo?: false;
} | {
    title: undefined;
    author: undefined;
    url: undefined;
    readonly _fetchData: string;
    readonly lazyFetchInfo: true;
}
