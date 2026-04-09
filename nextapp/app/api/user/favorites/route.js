import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Movie from '@/lib/models/Movie.model';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await clerkClient().users.getUser(userId);

        const favorites = user?.privateMetadata?.favorites ?? [];

        await connectDb();

        const movies = favorites.length
            ? await Movie.find({ _id: { $in: favorites } })
            : [];

        return NextResponse.json({ success: true, movies });
    } catch (error) {
        console.error('Error getFavorites:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
