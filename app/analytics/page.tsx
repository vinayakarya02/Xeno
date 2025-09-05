"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">No analytics data found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Analytics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgDeliveryRate?.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Segments</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topSegments?.length ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topSegments} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="audienceSize" fill="#6366f1" name="Audience Size" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2 mt-4">
                  {data.topSegments.map((seg: any) => (
                    <li key={seg._id} className="border-b pb-1">
                      <span className="font-medium">{seg.name}</span> — Audience: {seg.audienceSize}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div>No segments found.</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentCampaigns?.length ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.recentCampaigns} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="deliveryRate" fill="#10b981" name="Delivery Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2 mt-4">
                  {data.recentCampaigns.map((c: any) => (
                    <li key={c._id} className="border-b pb-1">
                      <span className="font-medium">{c.name}</span> — {new Date(c.createdAt).toLocaleDateString()} — Delivery: {c.deliveryRate?.toFixed(1)}%
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div>No campaigns found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 