import Show from "../models/Show.model.js"
import Booking from "../models/Booking.model.js"
import Razorpay from "razorpay";
import { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } from "../config/env.js";
import crypto from 'crypto';
import { inngest } from "../inngest/index.js";



//Function to check availability of selected seats
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {

        const showData = await Show.findById(showId);
        if (!showData) {
            return false
        }
        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;

    } catch (error) {

        console.log(error.message);
        return false;
    }
}




export const createBooking = async (req, res) => {
    try {

        const { userId } = req.auth();

        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        //check if the seat is available for the selected show 
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Selected Seats are not available."
            })
        }

        //get the show details
        const showData = await Show.findById(showId).populate('movie');

        //Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        })



        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        //Razerpay Gateway
        //razorpay instance
        const razorpayInstance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET_KEY
        })

        //create an order
        const options = {
            amount: booking.amount * 100, //the amount is stored in the paise format
            currency: "INR",
            expire_by: Math.floor(Date.now() / 1000) + (10 *60),
            notes: {
                bookingId: booking._id.toString()
            }

        }

        const order = await razorpayInstance.orders.create(options);
        booking.order = order;
        await booking.save();


        //inngest event to cancel the booking
        await inngest.send({
            name: 'app/checkpayment',
            data: {
                bookingId: booking._id.toString()
            }
            
        })



        res.json({
            success: true,
            order: booking.order
        })

    } catch (error) {

        console.log("Error while creating: ", error.message);
        res.json({
            success: false,
            message: error.message
        })

    }
}


//verify the payment made by the user
export const verifyPaymentStatus = async (req, res) => {

    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: 'Missing payment details' });
        }

        const booking = await Booking.findById(bookingId);

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_SECRET_KEY)
            .update(body)
            .digest('hex');

        const isValid =
            expectedSignature.length === razorpay_signature.length &&
            crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(razorpay_signature, 'hex'));

        if (isValid) {

            //update payment status on the database
            booking.isPaid = true;
            booking.order = { ...booking.order, status: "paid" ,  razorpay_order_id, razorpay_payment_id, razorpay_signature };
            await booking.save();

            res.json({
                success: true,
                message: "Payment Successfull!"
            })
        } else {

            res.json({
                success: false,
                message: "Payment Unsuccessfull",
            })
        }

    } catch (error) {
        res.json({
            success: false,
            message: "Payment Unsuccessfull",
        })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({
            success: true,
            occupiedSeats
        })

    } catch (error) {
        console.log("Error get occupiedSeats: ", error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}
