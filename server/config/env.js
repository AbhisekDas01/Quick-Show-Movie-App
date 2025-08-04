import {config} from '@dotenvx/dotenvx';

config({path: `.env`});

export const {
    PORT,
    MONGODB_URI
    
} = process.env;