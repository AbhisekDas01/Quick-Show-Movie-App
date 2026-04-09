import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

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

        return NextResponse.json({ success: true, isAdmin: true });
    } catch (error) {
        console.error('Error isAdmin:', error.message);
        return NextResponse.json({ success: false, message: 'Not Authorized' }, { status: 403 });
    }
}
