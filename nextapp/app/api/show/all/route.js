import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import Show from '@/lib/models/Show.model';

export async function GET() {
    try {
        await connectDb();

        const shows = await Show.find({
            showDateTime: { $gte: new Date() }
        })
            .populate('movie')
            .sort({ showDateTime: 1 });

        // Return unique movies from upcoming shows
        const uniqueMovies = Array.from(
            new Map(shows.map(show => [show.movie?._id?.toString(), show.movie])).values()
        ).filter(Boolean);

        return NextResponse.json({ success: true, shows: uniqueMovies });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
