import mongoose from "mongoose";
import { env } from "../../config/env.service.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}