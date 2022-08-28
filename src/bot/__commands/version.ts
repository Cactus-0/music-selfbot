import type { ICommand } from "bot/command";
import { versions } from "utils/versions";

export const command: ICommand = {
    name: 'version',
    args: [],
    description: 'print bot\'s version',
    
    exec: async ({ log, logTarget }) => {
        const {
            current,
            installed,
            availableNewVersion
        } = await versions();

        if (logTarget === 'console') {
            log(`Installed version: <grey>v${current}</>`);
            log(`Latest version: <grey>v${installed}</>`);

            if (availableNewVersion)
                log(`You can install new version from <grey>https://github.com/Cactus-0/music-selfbot</>`)
        } else {
            log(
                `Installed version: \`v${current}\`\n`
                + `Latest version: \`v${installed}\``
                + (
                    availableNewVersion
                        ? '\nYou can install new version from https://github.com/Cactus-0/music-selfbot'
                        : ''
                )
            );
        }
    },
}
