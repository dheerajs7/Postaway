import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log( process.env.MONGODB_URI);

        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/Postaway`);
        console.log(` \n MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MONGODB error  for Connection",error);
        process.exit(1);
    }
};

export default connectDB
