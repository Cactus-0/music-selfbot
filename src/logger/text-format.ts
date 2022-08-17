import colors from 'colors/safe';

export function log(text: string): typeof log {
    console.log(textFormat(text));
    return log;
}

export function textFormat(text: string): string {
    return text.replace(/<(?<color>\w+)>(?<text>[^<>]*)<\/>/gi, (...[ , , , , , { color, text } ]) => {
        // @ts-ignore
        return (colors[color]?.(text) ?? text)
            .replaceAll(';sl', '<')
            .replaceAll(';sr', '>')
    });
}
