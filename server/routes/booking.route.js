import { Router } from "express";
import { createBooking, getOccupiedSeats, verifyPaymentStatus } from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post('/create' , createBooking);
bookingRouter.get('/seats/:showId' , getOccupiedSeats);
bookingRouter.post('/verify-payment' , verifyPaymentStatus);


export default bookingRouter;