import { textFormat } from './text-format';

export function input(prompt: string = ''): Promise<string> {
    process.stdout.write(textFormat(prompt));

    return new Promise(resolve => {
        process.stdin.once('data', data => resolve(data.toString('utf-8').trim()));
    });
}
