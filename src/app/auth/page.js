"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { toast } from "react-toastify"; // assuming you're using react-toastify for notifications
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/"; // Redirect logged-in users to home
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Signed in successfully!");
        window.location.href = "/";
      } else {
        const errorText = await response.text();
        // console.error("Error login:", errorText);
        toast.error("Error login: " + errorText);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`relative w-[768px] max-w-full min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-500 ${
          isSignUp ? "scale-105" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
            isSignUp ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          <h1 className="text-2xl font-bold">Create Account</h1>
          <input
            type="text"
            placeholder="Name"
            className="mt-3 p-2 w-full border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="mt-3 p-2 w-full border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="mt-3 p-2 w-full border rounded"
          />
          <button
            className="mt-5 px-6 py-2 bg-red-500 text-white rounded"
            onClick={() => alert("Sign Up clicked!")}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
            isSignUp ? "opacity-0 -z-10" : "opacity-100 z-10"
          }`}
        >
          <h1 className="text-2xl font-bold">Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 p-2 w-full border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 p-2 w-full border rounded"
          />
          <a href="#" className="mt-2 text-sm text-blue-500">
            Forgot your password?
          </a>
          <button
            className="mt-5 px-6 py-2 bg-red-500 text-white rounded"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>

        {/* Overlay Container */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex flex-col items-center justify-center transition-transform duration-500">
          {isSignUp ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Already signed up?</h1>
              <p className="mt-2 text-sm">
                Log in to manage your orders effortlessly!
              </p>
              <button
                className="mt-4 px-6 py-2 border border-white rounded"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="mt-2 text-sm">
                Join Order Hub! Simplify Your Ordering Process
              </p>
              <button
                className="mt-4 px-6 py-2 border border-white rounded"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
