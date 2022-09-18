import { ILazyTrackData, ITrack } from "../types";
import spotify from 'spotify-url-info';
import fetch from 'isomorphic-unfetch';
import ytfps from 'ytfps';


const { getTracks } = spotify(fetch);


export async function getPlaylistInfo(url: string | URL): Promise<ITrack[]> {
    if (!(url instanceof URL))
        url = new URL(url);
    
    if (url.host === 'open.spotify.com') {
        const tracks = await getTracks(url.toString());

        return tracks.map<ILazyTrackData>(track => ({
            title: undefined,
            author: undefined,
            url: undefined,
            lazyFetchInfo: true,
            _fetchData: !!track.artists
                ? `${track.artists[0].name} - ${track.name}`
                : track.name
        }));
    }

    const { videos } = await ytfps(url.toString());

    for (const video of <any[]>videos) {
        delete video.id;
        delete video.milis_length;
        delete video.length;
        delete video.thumbnail_url;

        video.author = video.author.name;
    }

    return <any>videos;
}
