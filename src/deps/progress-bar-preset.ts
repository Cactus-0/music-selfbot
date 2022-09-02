import { Preset } from "cli-progress";
import { textFormat } from "logger";

export const progressBarPreset: Preset = {
    format: textFormat('<green>{msg}</> <cyan>{bar}</> {percentage}%'),
    barCompleteChar: '\u25b0',
    barIncompleteChar: '\u25b1'
};
