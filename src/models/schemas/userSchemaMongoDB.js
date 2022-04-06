import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 120 },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export { userSchema };
