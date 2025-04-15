import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/greencart`);

    // Log the name of the database you're connected to
    console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
};

export default connectDB;
