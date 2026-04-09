import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDb } from '@/lib/db';
import Show from '@/lib/models/Show.model';
import Booking from '@/lib/models/Booking.model';
import Razorpay from 'razorpay';
import { inngest } from '@/lib/inngest';

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.error('checkSeatsAvailability error:', error.message);
        return false;
    }
};

export async function POST(request) {
    let booking = null;
    let showData = null;
    let selectedSeats = [];

    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDb();

        const body = await request.json();
        const { showId } = body;
        selectedSeats = body.selectedSeats ?? [];

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return NextResponse.json({ success: false, message: 'Selected Seats are not available.' });
        }

        showData = await Show.findById(showId).populate('movie');

        booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });

        selectedSeats.forEach(seat => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified('occupiedSeats');
        await showData.save();

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });

        const order = await razorpayInstance.orders.create({
            amount: booking.amount * 100,
            currency: 'INR',
            notes: {
                bookingId: booking._id.toString()
            }
        });

        booking.order = order;
        await booking.save();

        await inngest.send({
            name: 'app/checkpayment',
            data: { bookingId: booking._id.toString() }
        });

        return NextResponse.json({ success: true, order: booking.order });
    } catch (error) {
        console.error('Error while creating booking:', error);

        // Rollback the selected seats
        try {
            if (showData && selectedSeats.length > 0) {
                selectedSeats.forEach(seat => {
                    if (showData.occupiedSeats?.[seat]) {
                        delete showData.occupiedSeats[seat];
                    }
                });
                showData.markModified('occupiedSeats');
                await showData.save();
            }

            if (booking?._id) {
                await Booking.findByIdAndDelete(booking._id);
            }
        } catch (rollbackErr) {
            console.error('Rollback failed:', rollbackErr);
        }

        return NextResponse.json({ success: false, message: error.message || 'Error while booking!' }, { status: 500 });
    }
}
