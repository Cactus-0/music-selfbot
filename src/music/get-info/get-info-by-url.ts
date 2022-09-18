import spotify from 'spotify-url-info';
import fetch from 'isomorphic-unfetch';
import ytdl from 'ytdl-core';

import { validHosts } from '..';
import type { ITrack } from '..';
import { getInfoByName } from './get-info-by-name';
import { getPlaylistInfo } from './get-playlist-info';

const { getPreview: getSpotifyDetails } = spotify(fetch);

export async function getInfoByUrl(url: string): Promise<ITrack | ITrack[]> {
    const { host, pathname } = new URL(url);

    // @ts-expect-error
    if (!validHosts.includes(host))
        throw new TypeError(`"${host}" is not a valid website. Only ${validHosts.join(', ')} are supported`);

    if (host === 'open.spotify.com') {
        const { artist, title, type } = await getSpotifyDetails(url);

        if (type === 'playlist')
            return await getPlaylistInfo(url);

        if (type !== 'track')
            throw new Error('Spotify URL is not a track');

        return await getInfoByName(`${title} - ${artist}`);
    }

    if (pathname === '/playlist')
        return await getPlaylistInfo(url);

    const {
        videoDetails: {
            author: { name: author },
            title
        }
    } = await ytdl.getBasicInfo(url);

    return { author, title, url };
}

