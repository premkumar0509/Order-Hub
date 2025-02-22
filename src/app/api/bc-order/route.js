import { NextResponse } from "next/server";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to get Microsoft authentication token
const getToken = async () => {
  try {
    const response = await axios.post(
      process.env.TOKEN_BASEURL ,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: process.env.SCOPEURL,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data.access_token; // Return only the access token
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw new Error("Failed to fetch token");
  }
};

// GET method to fetch orders from Business Central
export async function GET() {
  try {
    const accessToken = await getToken(); // Retrieve token dynamically

    const response = await axios.get(
      process.env.BC_ORDER_API,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data.value);
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}