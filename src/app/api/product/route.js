import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import product from "@/models/product";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    if (productId) {
      // Fetch product by ID
      const productById = await product.findById(productId);

      if (!productById) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json(productById);
    } else {
      // Fetch all products
      const products = await product.find();
      return NextResponse.json(products);
    }
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
    const { name, price, description, imageUrl,stock } = body;

    if (!name || !price || !description || !imageUrl ||!stock) {
      return NextResponse.json(
        { error: "All fields (name, price, description, imageUrl, stock) are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create a new product
    const newProduct = new product({
      name,
      price,
      stock,
      description,
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

// PATCH Method to update a product by ID
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');  // assuming productId is passed in query params
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
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId'); 

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
