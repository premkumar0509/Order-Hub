"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // ✅ Import this
import { motion } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const user = useAuth();
  const pathname = usePathname(); // ✅ Get current route
  const [scroll, setScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get initials if profilePic is missing
  const getInitials = (email) => {
    if (!email) return "??";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/auth"; // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full px-6 py-3 flex justify-between items-center z-50 transition-all ${
        scroll ? "bg-white shadow-lg py-2" : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Brand Logo */}
      <Link href="/" className="text-3xl font-bold text-blue-600">
        Order Hub
      </Link>

      {/* Profile & Login Button */}
      <div className="relative">
        {user ? (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user.profilePic ? (
              <motion.img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border"
                whileHover={{ scale: 1.1 }}
              />
            ) : (
              <motion.div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg"
                whileHover={{ scale: 1.1 }}
              >
                {getInitials(user.email)}
              </motion.div>
            )}
          </div>
        ) : (
          // ✅ Hide the Login button if the user is on the `/auth` page
          pathname !== "/auth" && (
            <motion.button
              onClick={() => window.location.replace("/auth")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.button>
          )
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && user && (
          <motion.div
            className="absolute right-0 mt-3 w-48 bg-white shadow-md rounded-lg py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
            >
              <User size={18} /> Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
            >
              <Settings size={18} /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}