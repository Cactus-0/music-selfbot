import './tsconfig-paths-bootstrap';

import fs from 'fs';
import { createGettersDict } from './utils/getters-dict';
import { Constants } from './constants';

if (!fs.existsSync(Constants.DATA_DIR))
    fs.mkdirSync(Constants.DATA_DIR);

if (!fs.existsSync(Constants.CONFIG_FILE_PATH))
    fs.writeFileSync(Constants.CONFIG_FILE_PATH, '{}', 'utf-8');

createGettersDict({
    isDev: () => process.env.NODE_ENV === 'development',
    isProd: () => process.env.NODE_ENV === 'production',
}, process);

if (!process.isDev)
    process.env.NODE_ENV = 'production';

if (process.isProd)
    process.env.YTDL_NO_UPDATE = '1';
