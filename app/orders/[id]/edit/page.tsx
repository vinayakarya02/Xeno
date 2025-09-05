"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleChange = (e: any) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: order.status,
          amount: order.amount,
        }),
      });
      if (res.ok) {
        setSuccess("Order updated successfully!");
        setTimeout(() => router.push(`/orders/${id}`), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update order");
      }
    } catch (err) {
      setError("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Status</label>
            <Input name="status" value={order.status} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Amount</label>
            <Input name="amount" value={order.amount} onChange={handleChange} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/orders/${id}`)} className="ml-2">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 