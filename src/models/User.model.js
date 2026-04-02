import mongoose from "mongoose";
import Counter from "./Counter.model.js";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    address: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
      },
    },
    isMarried: {
      type: Boolean,
      default: false,
    },
    isEmployed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate numeric id before saving a new user
userSchema.pre("save", async function () {
  if (!this.isNew) return;

  const counter = await Counter.findByIdAndUpdate(
    { _id: "userId" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );

  this.id = counter.seq;
});

// user comes from your MongoDB URI in .env {That is what created user database}
// This line in your model file:
// const User = mongoose.model("User", userSchema);
// Mongoose automatically converts:
// "User" → "users"

// user (database)
// └── users (collection)
//     └── { documents }
// DB = user
// Collection = users

// Database name → comes from connection string
// Collection name → comes from Mongoose model name

// Model name: User
// Collection name becomes: users (usually plural + lowercase)
const User = mongoose.model("User", userSchema);

export default User;
