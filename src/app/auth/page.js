"use client";

import { useState } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Track whether it's login or signup

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., API call)
    console.log("Form submitted", isLogin ? "Login" : "Signup");

    // Example using fetch (replace with your actual API endpoint)
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    fetch(isLogin ? '/api/login' : '/api/signup', {  // Adjust API routes
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
      if (isLogin) {  // Assuming the response has a success flag
        window.location.href = '/';  // Redirect to home page
      }
      // Handle successful login/signup (e.g., redirect, update state)
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors (e.g., display error message)
    });

  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen justify-center bg-gray-100"> {/* Added styling */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> {/* Card container */}
        <h1 className="text-3xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            
                      {!isLogin && ( // Conditionally render additional fields for signup
                        <div>
                          <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      )}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>


          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isLogin ? "Login" : "Signup"}
          </button>

          <p className="text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:underline ml-1"
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}