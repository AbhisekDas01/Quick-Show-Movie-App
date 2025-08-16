import { Router } from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express";

const userRouter = Router();

userRouter.get('/bookings' , requireAuth() , getUserBookings);
userRouter.post('/update-favorite', requireAuth(), updateFavorite);
userRouter.get('/favorites' , requireAuth() ,  getFavorites);


export default userRouter;