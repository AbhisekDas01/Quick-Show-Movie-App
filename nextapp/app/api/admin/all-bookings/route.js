import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Booking from '@/lib/models/Booking.model';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const clerkUser = await clerkClient().users.getUser(userId);
        if (clerkUser.privateMetadata?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Not Authorized' }, { status: 403 });
        }

        await connectDb();

        const bookings = await Booking.find({})
            .populate('user')
            .populate({
                path: 'show',
                populate: { path: 'movie' }
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, bookings });
    } catch (error) {
        console.error('Error getAllBookings:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
