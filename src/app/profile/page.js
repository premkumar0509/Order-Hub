"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "", // Format YYYY-MM-DD
      });
      setLoading(false);
    }
  }, [user]);

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user?userId=${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully! 🎉");
        setEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong! ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg mt-3 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

      {user ? (
        <>
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-16 h-16 rounded-full border shadow-md"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl shadow-md">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">{user.name || "Your Name"}</p>
              <p className="text-gray-600">{user.email || "your@email.com"}</p>
            </div>
          </div>

          {/* Edit Form */}
          {editing ? (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="border p-2 rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                className="border p-2 rounded-md bg-gray-100 cursor-not-allowed"
                disabled
                placeholder="Email cannot be changed"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="border p-2 rounded-md"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-2 rounded-md"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <p className="text-gray-700">
                <span className="font-semibold">Phone:</span>{" "}
                {user.phone || "Not set"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date of Birth:</span>{" "}
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "Not set"}
              </p>

              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-lg text-red-500">User not found</p>
      )}
    </div>
  );
}