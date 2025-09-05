"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, MessageSquare, TrendingUp, Zap, Target, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalCustomers: number
  totalCampaigns: number
  deliveryRate: number
  activeSegments: number
  recentCampaigns: any[]
  topSegments: any[]
  performanceInsights: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalCampaigns: 0,
    deliveryRate: 0,
    activeSegments: 0,
    recentCampaigns: [],
    topSegments: [],
    performanceInsights: "",
  });
  const [insight, setInsight] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view dashboard.</div>;

  // Insights handlers
  const handleInsight = async (type: string) => {
    setInsight(null);
    setShowInsight(true);
    // Simulate API call
    setTimeout(() => {
      if (type === "High Performance") setInsight("High-value segments delivered 96%+ delivery rates. Focus on these for best results.");
      else if (type === "Targeting Recommendation") setInsight("Target customers who made a purchase in the last 3 months for higher engagement.");
      else if (type === "Audience Optimization") setInsight("Optimize by combining high-value and frequent buyers for maximum ROI.");
      else setInsight("No insight available.");
    }, 700);
  };
  // Quick actions
  const handleCreateSegment = () => router.push("/campaigns/create");
  const handleSendCampaign = () => router.push("/campaigns/create");
  const handleViewAnalytics = () => router.push("/analytics");

  useEffect(() => {
    // Simulate loading dashboard data
    const mockStats: DashboardStats = {
      totalCustomers: 1247,
      totalCampaigns: 23,
      deliveryRate: 94.2,
      activeSegments: 8,
      recentCampaigns: [
        {
          id: "1",
          name: "Win-back High Value Customers",
          status: "sent",
          sent: 1180,
          deliveryRate: 94.6,
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          name: "New Product Launch",
          status: "sending",
          sent: 845,
          deliveryRate: 94.7,
          createdAt: "2024-01-14",
        },
      ],
      topSegments: [
        { name: "High Value Customers", size: 156, performance: 96.2 },
        { name: "Frequent Buyers", size: 342, performance: 93.8 },
        { name: "Recent Visitors", size: 789, performance: 91.5 },
      ],
      performanceInsights:
        "Your campaigns reached 3,247 customers this month. High-value customer segments showed 96% delivery rates, outperforming general audiences by 8%. Consider targeting similar demographics for future campaigns.",
    }
    setStats(mockStats)
  }, [])

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
              <Link href="/dashboard" className="text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/campaigns" className="text-gray-500 hover:text-gray-900">
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of your customer engagement platform</p>
          </div>
          <Button asChild>
            <Link href="/campaigns/create">
              <Zap className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSegments}</div>
              <p className="text-xs text-muted-foreground">2 created today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Campaigns
                </CardTitle>
                <CardDescription>Latest campaign performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{campaign.sent.toLocaleString()} sent</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">{campaign.deliveryRate}%</div>
                        <div className="text-xs text-gray-500">delivery rate</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/campaigns">View All Campaigns</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Segments */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Top Segments
                </CardTitle>
                <CardDescription>Best performing audience segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topSegments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{segment.name}</span>
                        <span className="text-sm text-gray-500">{segment.size} customers</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Performance</span>
                          <span>{segment.performance}%</span>
                        </div>
                        <Progress value={segment.performance} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              AI Performance Insights
            </CardTitle>
            <CardDescription>Intelligent analysis of your campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-gray-700">{stats.performanceInsights}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleInsight("High Performance")}>High Performance</Button>
              <Button size="sm" variant="outline" onClick={() => handleInsight("Targeting Recommendation")}>Targeting Recommendation</Button>
              <Button size="sm" variant="outline" onClick={() => handleInsight("Audience Optimization")}>Audience Optimization</Button>
            </div>
            {showInsight && (
              <div className="mt-4 p-4 bg-white border rounded shadow">
                {insight ? <span className="text-purple-700">{insight}</span> : <span>Loading...</span>}
                <Button size="sm" variant="ghost" className="ml-4" onClick={() => setShowInsight(false)}>Close</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCreateSegment}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Create Segment</h3>
                  <p className="text-sm text-gray-500">Build new audience rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleSendCampaign}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Send Campaign</h3>
                  <p className="text-sm text-gray-500">Launch new campaign</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewAnalytics}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">View Analytics</h3>
                  <p className="text-sm text-gray-500">Detailed performance data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
