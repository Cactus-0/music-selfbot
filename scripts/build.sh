#!/bin/bash
rm -rf bin
tsc --project ./tsconfig.build.json
pkg .
tar -zcvf ./bin/build.tar.gz ./bin/cactus-music-selfbot
rm -rf ./bin/cactus-music-selfbot
