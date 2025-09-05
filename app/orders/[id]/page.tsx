"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.order) setOrder(data.order);
        else setError("Order not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order._id}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{order.status || "Placed"}</Badge>
            <span className="text-gray-500 text-sm">Created: {new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Customer:</strong> {order.customerName}
          </div>
          <div>
            <strong>Amount:</strong> ₹{order.amount}
          </div>
          <div>
            <strong>Items:</strong> {order.items?.map((item: any, idx: number) => <span key={idx}>{item.name} (x{item.qty}) </span>)}
          </div>
          <Button variant="outline" onClick={() => router.push(`/orders/${order._id}/edit`)}>Edit Order</Button>
        </CardContent>
      </Card>
    </div>
  );
} 