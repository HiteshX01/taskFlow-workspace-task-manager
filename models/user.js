import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
})

export const userModel = mongoose.model('user', userSchema)