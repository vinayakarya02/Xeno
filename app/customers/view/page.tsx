"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerType {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ViewCustomersPage() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!hydrated) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">View Customers</h1>
      <ul>
        {customers.map((c) => (
          <li key={c._id} className="flex items-center gap-4 border-b py-2">
            <span className="flex-1">{c.name}</span>
            <span className="flex-1">{c.email}</span>
            <span className="flex-1">{c.phone}</span>
            <button
              className="bg-gray-200 px-2 py-1 rounded"
              onClick={() => router.push(`/customers/${c._id}`)}
            >
          
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 