import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET Method to fetch all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().populate('items.productId');
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method to create a new order
export async function POST(req) {
  try {
    // Parse incoming data from the request body
    const body = await req.json();

    // Ensure required fields are present
    const { userId, items, total } = body;

    if (!userId || !items || !total) {
      return NextResponse.json(
        { error: "All fields (userId, items, total) are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      total,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    return NextResponse.json(savedOrder, { status: 201 }); // Return the created order
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Method to update an order by ID
export async function PUT(req) {
  try {
    const { orderId } = req.query; // assuming orderId is passed in query params
    const body = await req.json(); // Assuming the request body contains the update data
    
    await connectDB();
    
    // Update the order by its ID
    const updatedOrder = await Order.findByIdAndUpdate(orderId, body, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Method to delete an order by ID
export async function DELETE(req) {
  try {
    const { orderId } = req.query; // assuming orderId is passed in query params

    await connectDB();
    
    // Delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}