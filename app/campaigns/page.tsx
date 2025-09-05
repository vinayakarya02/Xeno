"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MessageSquare, Users, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Campaign {
  id: string
  name: string
  status: "sent" | "draft" | "sending" | "failed"
  audienceSize: number
  sent: number
  failed: number
  deliveryRate: number
  createdAt: string
  message: string
  tags: string[]
}

export default function CampaignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load campaigns");
        setLoading(false);
      });
  }, []);

  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) return null;
  if (status === "loading" || loading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view campaigns.</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (campaign.status && campaign.status.toLowerCase() === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "sending":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete campaign");
      }
    } catch (err) {
      setError("Failed to delete campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Xeno CRM
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/campaigns" className="text-gray-900 font-medium">
                Campaigns
              </Link>
              <Link href="/customers" className="text-gray-500 hover:text-gray-900">
                Customers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-2">Manage and track your marketing campaigns</p>
          </div>
          <Button asChild>
            <Link href="/campaigns/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="sending">Sending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign._id || campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{campaign.message}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {campaign.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(campaign.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6 min-w-[120px]">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/campaigns/${campaign._id}/edit`)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(campaign._id)}>
                      Delete
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => router.push(`/campaigns/${campaign._id}`)}>
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first campaign"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button asChild>
                    <Link href="/campaigns/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
