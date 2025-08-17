import sendEmail from "../config/nodeMailer.js";
import Booking from "../models/Booking.model.js";
import Show from "../models/Show.model.js";
import User from "../models/User.model.js";
import { Inngest } from "inngest";
import { bookingConfirmationTemplate } from "../utils/emailTemplate.js";
import formatDateTime from "../utils/formatDateTime.js";
import { TMDB_IMAGE_BASE_URL } from "../config/env.js";
import { newShowNotificationTemplate } from "../utils/newDropEmailNotification.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });


const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.create(userData);
    }
)

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        const { id } = event.data;

        await User.findByIdAndDelete(id);
    }
)

const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-with-clerk' },
    { event: 'clerk/user.updated' },

    async ({ event }) => {

        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.findByIdAndUpdate(id, userData);

    }
)

//Inngest function to cancle booking and release the seats of show after 10 min if payment is not made 
const releaseSeatsDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {

        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const { bookingId } = event.data;

            const booking = await Booking.findById(bookingId);

            //if payment is not made 
            if (!booking?.isPaid) {

                const show = await Show.findById(booking.show);

                booking?.bookedSeats.forEach(seat => {
                    delete show.occupiedSeats[seat];
                });

                show.markModified('occupiedSeats');
                await show.save();

                //delete booking
                await Booking.findByIdAndDelete(booking._id);

            }
        })
    }

)

//Inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email' },
    { event: 'app/show.booked' },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: 'movie', model: 'Movie' }
        }).populate('user');


        await sendEmail({

            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
            body: bookingConfirmationTemplate({
                logoUrl: `https://raw.githubusercontent.com/AbhisekDas01/Quick-Show-Movie-App/refs/heads/main/client/src/assets/logo.png`,
                posterUrl: `${TMDB_IMAGE_BASE_URL}${booking?.show?.movie?.poster_path}`,
                movieTitle: booking.show.movie.title,
                dateTimeText: formatDateTime(booking.show.showDateTime),
                seatsText: booking.bookedSeats.join(', '),
                userName: booking.user.name,
                totalText: booking.show.showPrice * booking.bookedSeats.length,
                year: new Date(booking.show.movie.release_date).getFullYear(),
                genre: booking.show.movie.genres.slice(0, 3).map(({ name }) => name).join(', ')
            })
        })

    }
)

//send new show notifications 
const sendNewShowNotifications = inngest.createFunction(
    { id: 'send-new-show-notifications' },
    { event: 'app/show.added' },
    async ({ event }) => {


        const {movieId , movieTitle , posterUrl , year , genre , description , bookingUrl} = event.data;

        const users = await User.find({});

        for (const user of users) {

            console.log(user);

            await sendEmail({
                to: user.email,
                subject: `🎬 New Show Added: ${movieTitle}`,
                body: newShowNotificationTemplate({
                    userName: user.name,
                    movieTitle,
                    posterUrl,
                    year,
                    genre , 
                    description,
                    bookingUrl

                })
            })
        }
        return {message: "Notification sent"}
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsDeleteBooking,
    sendBookingConfirmationEmail,
    sendNewShowNotifications
];