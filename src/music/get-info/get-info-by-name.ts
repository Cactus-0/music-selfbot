import { search } from "youtube-search-without-api-key";

import { ITrack } from "..";
import { getInfoByUrl } from "./get-info-by-url";

export async function getInfoByName(name: string): Promise<ITrack> {    
    const searchResult = await search(name);

    if (!searchResult?.length)
        throw new Error(`No results found for "${name}"`);

    const [{ url }] = searchResult;

    // @ts-expect-error
    return await getInfoByUrl(url);
}
