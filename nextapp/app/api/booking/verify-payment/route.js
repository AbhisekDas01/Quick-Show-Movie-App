import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import Booking from '@/lib/models/Booking.model';
import { inngest } from '@/lib/inngest';
import crypto from 'crypto';

export async function POST(request) {
    try {
        await connectDb();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ success: false, message: 'Missing payment details' });
        }

        const booking = await Booking.findById(bookingId);

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(body)
            .digest('hex');

        const isValid =
            expectedSignature.length === razorpay_signature.length &&
            crypto.timingSafeEqual(
                Buffer.from(expectedSignature, 'hex'),
                Buffer.from(razorpay_signature, 'hex')
            );

        if (isValid) {
            booking.isPaid = true;
            booking.order = {
                ...booking.order,
                status: 'paid',
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            };
            await booking.save();

            await inngest.send({
                name: 'app/show.booked',
                data: { bookingId }
            });

            return NextResponse.json({ success: true, message: 'Payment Successful!' });
        } else {
            return NextResponse.json({ success: false, message: 'Payment Unsuccessful' });
        }
    } catch (error) {
        console.error('Error verifyPaymentStatus:', error.message);
        return NextResponse.json({ success: false, message: 'Payment Unsuccessful' }, { status: 500 });
    }
}
