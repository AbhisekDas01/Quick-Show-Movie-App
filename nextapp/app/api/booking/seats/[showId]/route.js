import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import Show from '@/lib/models/Show.model';

export async function GET(request, { params }) {
    try {
        await connectDb();

        const { showId } = await params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        return NextResponse.json({ success: true, occupiedSeats });
    } catch (error) {
        console.error('Error getOccupiedSeats:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
