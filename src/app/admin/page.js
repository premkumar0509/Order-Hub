"use client";
import Link from "next/link";
import { CubeIcon, ClipboardCheckIcon } from "@heroicons/react/solid";

export default function Admin() {
  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-center">Admin Dashboard</h1>
      <br></br>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/products">
          <button className="flex items-center text-white bg-blue-500 p-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
            <CubeIcon className="h-6 w-6 mr-2" />
            Manage Products
          </button>
        </Link>
        <Link href="/admin/orders">
          <button className="flex items-center text-white bg-blue-500 p-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
            <ClipboardCheckIcon className="h-6 w-6 mr-2" />
            Manage Orders
          </button>
        </Link>
      </section>
    </div>
  );
}