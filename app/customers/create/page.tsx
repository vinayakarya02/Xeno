"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (res.ok) {
        setSuccess("Customer added successfully!");
        setTimeout(() => router.push("/customers"), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add customer");
      }
    } catch (err) {
      setError("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Customer"}
            </Button>
            <Button variant="outline" type="button" onClick={() => router.push("/customers")} className="ml-2">
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 