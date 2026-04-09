import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Booking from '@/lib/models/Booking.model';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDb();

        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'show',
                populate: { path: 'movie' }
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, bookings });
    } catch (error) {
        console.error('Error getUserBookings:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
