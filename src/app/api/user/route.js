import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET Method - Fetch users or a specific user by ID
export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (userId) {
      // Fetch user by ID
      const userById = await User.findById(userId);

      if (!userById) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(userById);
    } else {
      // Fetch all users
      const users = await User.find();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH Method - Update user details
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Method - Delete user by ID
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectDB();
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method - Create a new user
export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, email, name, phone, dateOfBirth, profilePic, isAdmin = false } = body;

    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { error: "Username, name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create new user
    const newUser = new User({
      username,
      password, // You can hash the password before saving later
      email,
      name,
      phone,
      dateOfBirth,
      profilePic,
      isAdmin,
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}