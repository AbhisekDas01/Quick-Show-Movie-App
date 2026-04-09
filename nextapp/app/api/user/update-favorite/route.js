import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { movieId } = await request.json();

        const user = await clerkClient().users.getUser(userId);

        const favorites = user.privateMetadata?.favorites ?? [];

        const updatedFavorites = favorites.includes(movieId)
            ? favorites.filter(item => item !== movieId)
            : [...favorites, movieId];

        await clerkClient().users.updateUserMetadata(userId, {
            privateMetadata: { ...user.privateMetadata, favorites: updatedFavorites }
        });

        return NextResponse.json({ success: true, message: 'Favorite updated successfully.' });
    } catch (error) {
        console.error('Error updateFavorite:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
