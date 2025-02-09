"use client";
import { useState, useEffect } from "react";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order._id}
            <button className="ml-2 p-1 bg-red-500 text-white" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
            <button className="ml-2 p-1 bg-blue-500 text-white" onClick={() => handleEditOrder(order._id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button className="mt-4 p-2 bg-green-500 text-white" onClick={handleAddOrder}>Add Order</button>
    </div>
  );

  async function handleAddOrder() {
    // Implementation for adding an order
  }

  async function handleEditOrder(id) {
    // Implementation for editing an order
  }

  async function handleDeleteOrder(id) {
    // Implementation for deleting an order
  }
}