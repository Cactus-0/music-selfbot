import { set } from "utils/set";
import { configFile } from 'variables';
import { Client, TextChannel } from "discord.js-selfbot-v13";

export type LogTarget = 'console' | TextChannel;

const regexp = /^channel:(?<id>\d+)$/i;

export async function getLogTarget(client: Client): Promise<LogTarget> {
    const { logTo = 'console' } = configFile.data;

    if (logTo === 'console' || !regexp.test(logTo))
        return 'console';

    const id = regexp.exec(logTo)!.groups!.id;

    const channel = client?.channels.cache.get(id) || await client?.channels.fetch(id);

    if (!channel || channel.type in set.not('DM', 'GUILD_TEXT', 'GROUP_DM'))
        return 'console';

    return <TextChannel>channel;
}
