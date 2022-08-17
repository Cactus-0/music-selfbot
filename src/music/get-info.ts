import spotify from 'spotify-url-info';
import fetch from 'isomorphic-unfetch';
import { search } from 'youtube-search-without-api-key';

import { validHosts } from './constants';
import { ITrack } from './track';
import ytdl from 'ytdl-core';

const { getPreview: getSpotifyDetails } = spotify(fetch);

export async function getInfoByUrl(url: string): Promise<ITrack> {
    const { host } = new URL(url);

    // @ts-expect-error
    if (!validHosts.includes(host))
        throw new TypeError(`"${host}" is not a valid website. Only ${validHosts.join(', ')} are supported`);

    if (host === 'open.spotify.com') {
        const { artist, title, type } = await getSpotifyDetails(url)

        if (type !== 'track')
            throw new Error('Spotify URL is not a track');

        return await getInfoByName(`${title} - ${artist}`);
    }

    const {
        videoDetails: {
            author: { name: author },
            title
        }
    } = await ytdl.getBasicInfo(url);

    return { author, title, url };
}

export async function getInfoByName(name: string): Promise<ITrack> {
    const searchResult = await search(name);

    if (!searchResult?.length)
        throw new Error(`No results found for "${name}"`);

    const [{ url }] = searchResult;

    return await getInfoByUrl(url);
}
