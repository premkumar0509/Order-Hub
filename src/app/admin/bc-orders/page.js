"use client";

import { useState, useEffect } from "react";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/bc-order");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) =>
    order.number.toString().toLowerCase().includes(search.toLowerCase()) ||
    order.customerNumber.toString().toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.orderDate.toLowerCase().includes(search.toLowerCase()) ||
    order.currencyCode.toLowerCase().includes(search.toLowerCase()) ||
    order.totalAmountIncludingTax.toString().toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );
  

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">BC Orders List</h1>
        <input
          type="text"
          placeholder="Search orders"
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">Create Order</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : null}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-4 rounded shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Order No.</th>
              <th className="p-2">Customer No</th>
              <th className="p-2">Customer Name</th>
              <th className="p-2">Order Date</th>
              <th className="p-2">Currency Code</th>
              <th className="p-2">Total Amount Inc. Tax</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.number} className="border-t hover:bg-gray-100 transition duration-300">
                <td className="p-2 text-blue-600 cursor-pointer">{order.number}</td>
                <td className="p-2">{order.customerNumber}</td>
                <td className="p-2">{order.customerName}</td>
                <td className="p-2">{order.orderDate}</td>
                <td className="p-2">{order.currencyCode}</td>
                <td className="p-2">{order.totalAmountIncludingTax.toFixed(2)}</td>
                <td className="p-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastOrder >= filteredOrders.length}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
