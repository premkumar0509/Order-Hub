import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function GET(req) {
  await connectDB();
  const token = req.cookies.get("sessionToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 403 });
  }
}