import mongoose from "mongoose";

export const dbConnection = mongoose.connect('mongodb://0.0.0.0/javascript-backend').then(() => {
  console.log('database conneted');
})

