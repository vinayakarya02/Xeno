"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerType {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const router = useRouter();

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col items-center mb-6 gap-4 mt-16">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          onClick={() => router.push("/customers/create")}
        >
          Add Customer
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          onClick={() => router.push("/customers/view")}
        >
          View Customer
        </button>
      </div>
    </div>
  );
} 