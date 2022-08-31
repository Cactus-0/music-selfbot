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
                log(`Re-launch program to install new version`);
        } else {
            log(
                `Installed version: \`v${current}\`\n`
                + `Latest version: \`v${installed}\``
                + (
                    availableNewVersion
                        ? '\nRe-launch program to install new version'
                        : ''
                )
            );
        }
    },
}
