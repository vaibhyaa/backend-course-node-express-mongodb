import mongoose from "mongoose";
// Imports mongoose library.

// Creates async function because DB connection takes time.
const connectDB = async () => {
  try {
	// console.log(process.env.MONGO_URI);
    // Connects to MongoDB using your .env URL.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Prints connected DB host in terminal.
    console.log(`MongoDB Connected: ${conn.connection.host}`);


	// If DB fails, stop server immediately.
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
