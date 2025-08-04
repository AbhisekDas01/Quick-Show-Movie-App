import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDb = async () => {

    try {


        mongoose.connection.on('connected' , () => console.log("Database connected successfully"));
        
        await mongoose.connect(`${MONGODB_URI}/quickshow`);

        
        

    } catch (error) {
        
        console.log("Error while connection database : " , error.message);
    }
}

export default connectDb;