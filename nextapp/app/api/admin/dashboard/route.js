import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Booking from '@/lib/models/Booking.model';
import Show from '@/lib/models/Show.model';
import User from '@/lib/models/User.model';

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

        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');
        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };

        return NextResponse.json({ success: true, dashboardData });
    } catch (error) {
        console.error('Error getDashboardData:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
