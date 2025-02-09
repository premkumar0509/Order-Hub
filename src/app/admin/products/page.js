"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEdit } from "react-icons/fa";
import './style.css';
import Modal from './Modal';  // Ensure the import path is correct

export default function AdminPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  useEffect(() => {
    // Fetch Products from your API or data source
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("imageUrl", imageUrl);

    try {
      let response;
      if (editingProductId) {
        response = await fetch(`/api/product/${editingProductId}`, {
          method: "PATCH",
          body: formData,
        });
      } else {
        response = await fetch("/api/product", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        toast.success(editingProductId ? "Product updated successfully!" : "Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setEditingProductId(null);
        setIsModalOpen(false);
        // Fetch updated Products
        const updatedProducts = await fetch("/api/product").then((res) => res.json());
        setProducts(updatedProducts);
      } else {
        toast.error("Error adding/updating product: " + await response.text());
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        toast.error("Error deleting product");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.imageUrl);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProductId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button className="bg-blue-500 text-white p-2 rounded ml-4" onClick={handleAddProduct}>
          Add New Product
        </button>
      </header>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded text-black transform transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10"
        />
      </div>

      <div className="mt-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <li key={product._id} className="border p-4 rounded relative transform transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10 overflow-hidden">
              <div className="flex items-center justify-center space-x-4 absolute top-0 right-2 bottom-0">
                <FaEdit
                  onClick={() => handleEditProduct(product)}
                  className="cursor-pointer text-blue-500 text-2xl"
                />
                <FaTrash
                  onClick={() => handleDeleteProduct(product._id)}
                  className="cursor-pointer text-blue-500 text-2xl"
                />
              </div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.stock}</p>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          {editingProductId && (
            <input
              type="hidden"
              value={editingProductId}
              className="hidden"
            />
          )}
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
