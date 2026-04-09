import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Show from '@/lib/models/Show.model';

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

        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });

        return NextResponse.json({ success: true, shows });
    } catch (error) {
        console.error('Error getAllShows:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
