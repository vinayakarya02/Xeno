"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleChange = (e: any) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }),
      });
      if (res.ok) {
        setSuccess("Customer updated successfully!");
        setTimeout(() => router.push(`/customers/${id}`), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update customer");
      }
    } catch (err) {
      setError("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <Input name="name" value={customer.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <Input name="email" value={customer.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <Input name="phone" value={customer.phone} onChange={handleChange} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/customers/${id}`)} className="ml-2">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 