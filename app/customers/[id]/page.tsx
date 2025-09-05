"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.customer) setCustomer(data.customer);
        else setError("Customer not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load customer");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setOrdersLoading(true);
    setOrdersError(null);
    fetch(`/api/orders?customerId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders((data.orders || []).map((o: any) => ({ ...o, _id: o._id || o.id })));
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrdersError("Failed to load orders");
        setOrdersLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{customer.status || "Active"}</Badge>
            <span className="text-gray-500 text-sm">Created: {new Date(customer.createdAt).toLocaleString()}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Email:</strong> {customer.email}
          </div>
          <div>
            <strong>Phone:</strong> {customer.phone}
          </div>
          <div>
            <strong>Total Orders:</strong> {customer.totalOrders}
          </div>
          <div>
            <strong>Total Spent:</strong> ₹{customer.totalSpent}
          </div>
          <Button variant="outline" onClick={() => router.push(`/customers/${customer._id}/edit`)}>Edit Customer</Button>
        </CardContent>
      </Card>
      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Orders</h2>
        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : ordersError ? (
          <div className="text-red-500">{ordersError}</div>
        ) : orders.length === 0 ? (
          <div>No orders found for this customer.</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Order ID</th>
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
                  <td className="border px-2 py-1">₹{order.amount}</td>
                  <td className="border px-2 py-1">{new Date(order.date).toLocaleString()}</td>
                  <td className="border px-2 py-1">{order.status}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order._id}/edit`)}>
                      Edit
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
    </div>
  );
} 