import mongoose from "mongoose";

// Create schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.models.user || mongoose.model("user", userSchema);