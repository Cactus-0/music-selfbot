import fs from 'fs';
import { Constants } from './constants';

if (!fs.existsSync(Constants.DATA_DIR))
    fs.mkdirSync(Constants.DATA_DIR);

if (!fs.existsSync(Constants.CONFIG_FILE_PATH))
    fs.writeFileSync(Constants.CONFIG_FILE_PATH, '{}', 'utf-8');
