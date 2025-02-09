import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import user from "@/models/user";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET Method to fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await user.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET Method to fetch user by ID
export async function GET_USER_BY_ID(req) {
  try {
    const { userId } = req.query; // assuming userId is passed in query params
    await connectDB();
    const userById = await user.findById(userId);
    
    if (!userById) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userById);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Method to update a user by ID
export async function PUT(req) {
  try {
    const { userId } = req.query; // assuming userId is passed in query params
    const body = await req.json(); // Assuming the request body contains the update data
    
    await connectDB();
    const updatedUser = await user.findByIdAndUpdate(userId, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Method to delete a user by ID
export async function DELETE(req) {
  try {
    const { userId } = req.query; // assuming userId is passed in query params

    await connectDB();
    const deletedUser = await user.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method to create a new user
export async function POST(req) {
  try {
    // Parse incoming data from the request body
    const body = await req.json();

    // Ensure required fields are present
    const { username, password, isAdmin = false } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create a new user
    const newUser = new user({
      username,
      password, // You should ideally hash the password before saving
      isAdmin,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    return NextResponse.json(savedUser, { status: 201 }); // Return the created user
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
