"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/campaigns/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.campaign) setCampaign(data.campaign);
        else setError("Campaign not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load campaign");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: any) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaign.name,
          message: campaign.message,
        }),
      });
      if (res.ok) {
        setSuccess("Campaign updated successfully!");
        setTimeout(() => router.push(`/campaigns/${id}`), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update campaign");
      }
    } catch (err) {
      setError("Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaign) return <div>Campaign not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <Input name="name" value={campaign.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Message</label>
            <Textarea name="message" value={campaign.message} onChange={handleChange} rows={4} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/campaigns/${id}`)} className="ml-2">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 