import { ICliOptions } from "config";
import yargs from "yargs";

export const args = <ICliOptions>yargs(process.argv.slice(2))
    .option('token', {
        alias: 't',
        type: 'string',
        description: 'Launch with specific token'
    })
    .option('no-save', {
        alias: 's',
        type: 'boolean',
        description: 'Not save config file'
    })
    .option('no-load', {
        alias: 'l',
        type: 'boolean',
        description: 'Not load config file'
    })
    .argv;
