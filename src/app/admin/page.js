"use client";
import Link from "next/link";
import { CubeIcon, ClipboardCheckIcon } from "@heroicons/react/solid";

export default function Admin() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map(({ href, icon: Icon, label }, index) => (
          <Link key={index} href={href} className="group">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Icon className="h-10 w-10 text-blue-500 mb-3 group-hover:text-blue-600" />
              <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

const menuItems = [
  {
    href: "/admin/products",
    icon: CubeIcon,
    label: "Manage Products",
  },
  {
    href: "/admin/orders",
    icon: ClipboardCheckIcon,
    label: "Manage Orders",
  },
  {
    href: "/admin/bc-orders",
    icon: ClipboardCheckIcon,
    label: "BC Orders",
  },
];
