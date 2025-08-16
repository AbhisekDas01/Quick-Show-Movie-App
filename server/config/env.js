import {config} from '@dotenvx/dotenvx';

config({path: `.env`});

export const {
    PORT,
    MONGODB_URI,
    TMDB_API_KEY,
    RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_KEY,
    SMTP_PASS,
    SMTP_USER,
    SENDER_EMAIL,
    TMDB_IMAGE_BASE_URL
    
} = process.env;