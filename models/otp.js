import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otpHash:{
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically delete OTP after 10 minutes
  }
})

export const otpModel = mongoose.model('otp',otpSchema);