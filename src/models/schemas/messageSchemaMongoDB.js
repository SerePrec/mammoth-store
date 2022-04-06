import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  user: { type: String, required: true },
  type: { type: String, required: true },
  text: { type: String, required: true },
  replyMessage: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

export { messageSchema };
