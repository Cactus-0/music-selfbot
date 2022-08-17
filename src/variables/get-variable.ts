import type { IConfig } from 'config';
import { input } from 'logger';
import JSONFile from './json-file';
import { Constants } from '../constants';


// @ts-expect-error
export const configFile = new JSONFile<IConfig>(Constants.CONFIG_FILE_PATH);

configFile.load();

export async function getVariable(name: keyof IConfig, message: string = 'Please, enter a [var]: '): Promise<string> {
    if (configFile.data?.[name])
        return configFile.data?.[name]!;

    const result = (await input(message.replaceAll('[var]', name))).trim();

    configFile.data![name] = result;
    configFile.save();

    return result;
}
