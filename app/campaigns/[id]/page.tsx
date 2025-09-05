"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaign) return <div>Campaign not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{campaign.status}</Badge>
            <span className="text-gray-500 text-sm">Created: {campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : "N/A"}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Message:</strong>
            <div className="bg-gray-50 p-2 rounded mt-1">{campaign.message}</div>
          </div>
          <div>
            <strong>Audience Size:</strong> {campaign.audienceSize ?? "N/A"}
          </div>
          <div>
            <strong>Sent:</strong> {campaign.sent ?? 0} | <strong>Failed:</strong> {campaign.failed ?? 0} | <strong>Delivery Rate:</strong> {campaign.deliveryRate ?? 0}%
          </div>
          <div>
            <strong>Tags:</strong> {campaign.tags?.map((tag: string) => <Badge key={tag} variant="outline" className="ml-1">{tag}</Badge>)}
          </div>
          <Button variant="outline" onClick={() => router.push(`/campaigns/${campaign._id}/edit`)}>Edit Campaign</Button>
        </CardContent>
      </Card>
    </div>
  );
} 