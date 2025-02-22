import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Session from "@/models/session";

export async function POST(req) {
  await connectDB();

  // Get cookies instance
  const cookieStore = cookies();

  // Get session token from cookies
  const token = cookieStore.get("sessionToken")?.value;

  if (token) {
    await Session.deleteOne({ token });
  }

  // Clear session cookie
  await cookieStore.set("sessionToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expire cookie immediately
  });

  return NextResponse.json({ message: "Logged out successfully" });
}