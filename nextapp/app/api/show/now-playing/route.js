import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import axios from 'axios';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await clerkClient().users.getUser(userId);

        if (user.privateMetadata?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Not Authorized' }, { status: 403 });
        }

        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        return NextResponse.json({ success: true, movies: data.results });
    } catch (error) {
        console.error('Error in getNowPlayingMovies:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
