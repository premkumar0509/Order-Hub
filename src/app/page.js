"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track errors

  const [searchTerm, setSearchTerm] = useState(""); // Track search input

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");

        // Check if the response is not OK (status other than 2xx)
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        // Check if the response is in JSON format
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON response, but got something else");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message); // Update error state
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on search input
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-white text-black">
      <br></br>
      <br></br>
      <div className="min-h-screen p-4 pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
        <div className="flex justify-between items-center">
        {!loading && <h1 className="text-xl font-bold">Products</h1>}
          {!loading && (
            <div className="flex justify-end items-center space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="p-2 border rounded-md"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p> // Display error message
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col justify-between border p-4 rounded-lg shadow-lg"
              >
                <div className="flex-grow flex items-center justify-center">
                  {product.imageUrl ? (
                    <Image
                      className="object-cover rounded-lg"
                      src={product.imageUrl}
                      alt={product.name}
                      width={300}
                      height={200}
                    />
                  ) : (
                    <p>Image not available</p>
                  )}
                </div>
                <div className="mt-2">
                  <h2 className="text-lg font-medium">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="font-semibold">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
