import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Full name
  phone: { type: String, required: false }, // Phone number
  dateOfBirth: { type: Date, required: false }, // Date of Birth
  profilePic: { type: String, default: "" }, // Profile picture URL
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.models.user || mongoose.model("user", userSchema);