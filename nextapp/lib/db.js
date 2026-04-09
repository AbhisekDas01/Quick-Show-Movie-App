import mongoose from 'mongoose';

// Cache the connection across hot-reloads in development
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDb() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
