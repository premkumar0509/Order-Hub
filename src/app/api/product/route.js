import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import product from "@/models/product";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET Method to fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method to create a new product
export async function POST(req) {
  try {
    // Parse incoming data from the request body
    const body = await req.json();

    // Ensure required fields are present
    const { name, price, description, category, imageUrl } = body;

    if (!name || !price || !description || !category || !imageUrl) {
      return NextResponse.json(
        { error: "All fields (name, price, description, category, imageUrl) are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create a new product
    const newProduct = new product({
      name,
      price,
      description,
      category,
      imageUrl,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    return NextResponse.json(savedProduct, { status: 201 }); // Return the created product
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Method to update a product by ID
export async function PUT(req) {
  try {
    const { productId } = req.query; // assuming productId is passed in query params
    const body = await req.json(); // Assuming the request body contains the update data
    
    await connectDB();
    
    // Update the product by its ID
    const updatedProduct = await product.findByIdAndUpdate(productId, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Method to delete a product by ID
export async function DELETE(req) {
  try {
    const { productId } = req.query; // assuming productId is passed in query params

    await connectDB();
    
    // Delete the product by its ID
    const deletedProduct = await product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
