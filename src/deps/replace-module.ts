// @ts-nocheck

import './fake-ffmpeg-static';

import { Module } from 'module';
import path from 'path';

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function(request: string) {
    if (request === 'ffmpeg-static') {
        return originalResolveFilename.apply(
            this,
            [
                path.join(__dirname, './fake-ffmpeg-static.js'),
                ...[].slice.call(arguments, 1)
            ]
        )
    }

    return originalResolveFilename.apply(this, arguments);
}
