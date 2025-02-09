import mongoose from "mongoose";

// Create schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: false } // Add imageUrl field+
});

export default mongoose.models.product || mongoose.model("product", productSchema);