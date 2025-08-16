import {config} from '@dotenvx/dotenvx';

config({path: `.env`});

export const {
    PORT,
    MONGODB_URI,
    TMDB_API_KEY,
    RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_KEY
    
} = process.env;