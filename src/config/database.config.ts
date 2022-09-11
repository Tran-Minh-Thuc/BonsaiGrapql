import "dotenv/config";
import mongoose from "mongoose";

export async function connect(){
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("[Info] Connected to MongoDB !");
        return connection;
    } catch {
        console.log("[Error] connect failed");
    }
}