import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'get',
    description: 'get value from config',

    args: [
        {
            name: 'key',
            optional: true
        }
    ],

    exec: async ({ args: [name], log, vars: { configFile }, logTarget }) => {
        if (name) {
            if (logTarget === 'console')
                return void log(`[<gray>Config</>] ${name}: ${configFile.data?.[name as never] ?? '<red>not defined</>'}`)
            else
                return void await log(`\`${name}\` = ${configFile.data?.[name as never] ?? '**not defined**'}`)
        }

        if (logTarget === 'console') {
            log('\n - List of variables:\n');

            Object.entries(configFile.data).forEach(([name, value]) => {
                log(`<cyan>${name}</>: <grey>${value}</>`);
            });
        } else {
            await log(
                '```\n      - List of variables\n```\n'
                + Object.entries(configFile.data)
                    .map(([ name, value ], i) => `**${i + 1}.** \`${name} = "${value}"\``)
                    .join('\n')
            )
        }
    }
}
