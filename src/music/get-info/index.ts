import { isURL } from "utils/is-url";
import { getInfoByName } from "./get-info-by-name";
import { getInfoByUrl } from "./get-info-by-url";

export const getInfo = async (query: string) => {
  	try {
		return isURL(query)
			? await getInfoByUrl(query)
			: await getInfoByName(query);
	} catch (cause: unknown) {
		throw new Error(`Can't fetch "${query}".`, { cause });
	}
}
