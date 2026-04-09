import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import Show from '@/lib/models/Show.model';
import Movie from '@/lib/models/Movie.model';

export async function GET(request, { params }) {
    try {
        await connectDb();

        const { movieId } = await params;

        // Get all upcoming shows for the movie
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });

        const movie = await Movie.findById(movieId);

        const dateTime = {};

        shows.forEach(show => {
            const date = show.showDateTime.toISOString().split('T')[0];

            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({
                time: show.showDateTime,
                showId: show._id,
            });
        });

        return NextResponse.json({ success: true, movie, dateTime });
    } catch (error) {
        console.error('Error in getShow:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
