import {config} from '@dotenvx/dotenvx';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    MONGODB_URI
    
} = process.env;