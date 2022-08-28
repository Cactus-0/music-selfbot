import { ICommand, IExecutionEnvironment } from './command';

interface IExecArguments {
    command: ICommand;
    context: IExecutionEnvironment;
}

export async function execCommand({ command, context }: IExecArguments): pvoid {
    const minLength = command.args!.filter(arg => !arg.optional).length;
    const { args } = context;
    const length = args.length;

    if (length < minLength)
        throw new Error(`expected ${minLength} argument(-s) at least, but got ${length}`);

    command.args!.forEach((arg, i) => {
        if ((arg.optional && !args[i]) || arg.type === 'string' || !arg.type) return;

        if (arg.type === 'number' && isNaN(+args[i]))
            throw new Error(`argument ${i + 1} (${args[i]}) is expected to be a number`);
        else if (arg.type === 'number')
            return;

        const { test, errorMessage } = arg.type;

        if (!test(args[i])) {
            let message: string;
            
            if (!errorMessage)
                message = `argument ${i} (${args[i]}) is invalid`;
            else
                message = errorMessage(args[i], i);

            throw new Error(message);
        }
    });

    await command.exec(context);
}
