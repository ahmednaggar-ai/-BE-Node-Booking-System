import dotenv from "dotenv";
import path from "path";


dotenv.config({path : path.resolve('./config/.env')});

export const env = {
    PORT : process.env.PORT,
    MONGODB_URI : process.env.MONGODB_URI
}