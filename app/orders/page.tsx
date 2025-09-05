"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Order {
  _id: string;
  customerId: string;
  amount: number;
  date: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const orders = (data.orders || []).map((o: any) => ({
          ...o,
          _id: o._id || o.id,
        }));
        setOrders(orders);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        alert("Failed to delete order");
      }
    } catch {
      alert("Failed to delete order");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">Customer ID</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-2 py-1">{order._id}</td>
                <td className="border px-2 py-1">{order.customerId}</td>
                <td className="border px-2 py-1">₹{order.amount}</td>
                <td className="border px-2 py-1">{new Date(order.date).toLocaleString()}</td>
                <td className="border px-2 py-1">{order.status}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order._id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(order._id)}>
                    Delete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => router.push(`/orders/${order._id}`)}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 