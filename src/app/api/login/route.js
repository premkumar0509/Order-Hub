import { NextResponse } from "next/server";
import connectDB from '@/lib/db';
import User from '@/models/user';
import Session from '@/models/session';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers"; // Use Next.js cookies

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare plain text password
    if (password !== user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT session token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Store session in MongoDB
    await Session.create({
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1-hour expiration
    });

    // Get cookies instance inside the async function
    const cookieStore = await cookies(); // ✅ FIX: Await cookies() inside async function

    // Set secure HTTP-only cookie
    await cookieStore.set("sessionToken", token, {  // ✅ FIX: Use `await`
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}