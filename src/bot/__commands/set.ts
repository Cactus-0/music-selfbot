import type { ICommand } from 'bot/command';

export const command: ICommand = {
    name: 'set',
    description: 'set value to config file',

    args: [
        { name: 'key' },
        { name: 'value' }
    ],

    exec: async ({ args: [name, value], log, vars: { configFile }, logTarget }) => {
        if (!name || !value)
            throw new Error('Please, input name and value of the variable');
        
        // @ts-expect-error
        configFile.data[name] = value;

        configFile.save();

        if (logTarget === 'console')
            log(`[<gray>Config</>] <cyan>${name}</> now set to ${value}`);
        else
            log(`**\`${name} = "${value}"\`**`)
    }
}
