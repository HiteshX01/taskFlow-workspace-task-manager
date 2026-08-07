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
  }
})

export const otpModel = mongoose.model('otp',otpSchema);