import mongoose from "mongoose";

// Define a User schema for the database

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    favouriteMenus: { type: Array, required: true },
    favouriteMensas: { type: Array, required: true },
    appliedSettings: { type: Object, required: true },
  },
  { timestamps: true }
);

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
