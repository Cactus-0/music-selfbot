import axios from 'axios';
import { lt } from 'semver';

import { Constants } from '../constants';
// @ts-ignore
import manifest from '../../package.json';

interface IVersions {
	installed: string;
	current: string;
	availableNewVersion: boolean;
}

export async function versions(): Promise<IVersions> {
	const {
		data: { version: current },
	} = await axios.get<{ version: string }>(Constants.REMOTE_MANIFEST_URL, { responseType: 'json' });

    const installed = manifest.version;

    return {
        installed,
        current,
        availableNewVersion: lt(installed, current)
    }
}
