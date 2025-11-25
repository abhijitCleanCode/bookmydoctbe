import mongoose from "mongoose";
import { env } from "@config/env";

const MONGODB_URI = env.DATABASE_URI;
const DB_NAME = env.DATABASE_NAME;

const connectionOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
};

async function connectDb() {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, connectionOptions);

        console.log("\n MongoDB connected !! DB HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("src :: database :: connection.js :: connectDb :: MONGODB connection FAILED: ", error);
        process.exit(1);
    }
}

export default connectDb;
