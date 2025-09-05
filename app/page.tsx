"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession();
  interface Stats {
    totalCustomers: number;
    totalCampaigns: number;
    deliveryRate: number;
    activeSegments: number;
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setStats({
      totalCustomers: 1247,
      totalCampaigns: 23,
      deliveryRate: 94.2,
      activeSegments: 8,
    });
  }, []);

  if (!hydrated) return null;
  if (!stats) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Xeno CRM</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/campaigns" className="text-gray-500 hover:text-gray-900">
                Campaigns
              </Link>
              <Link href="/customers" className="text-gray-500 hover:text-gray-900">
                Customers
              </Link>
            </nav>
            <Button onClick={() => session ? signOut() : signIn("google") }>
              {session ? `Sign Out (${session.user?.name})` : "Sign In with Google"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Customer Engagement Platform</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build intelligent customer segments, create personalized campaigns, and deliver targeted messages with
            AI-powered insights.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href="/campaigns/create">Create Campaign</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSegments}</div>
              <p className="text-xs text-muted-foreground">2 created today</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Smart Segmentation
              </CardTitle>
              <CardDescription>
                Create dynamic customer segments with flexible rule logic and AI-powered insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Natural Language Rules</Badge>
                <Badge variant="secondary">Visual Rule Builder</Badge>
                <Badge variant="secondary">Real-time Preview</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                Personalized Campaigns
              </CardTitle>
              <CardDescription>
                Deliver targeted messages with AI-generated content and smart scheduling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">AI Message Generation</Badge>
                <Badge variant="secondary">Smart Scheduling</Badge>
                <Badge variant="secondary">Delivery Tracking</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                Intelligent Analytics
              </CardTitle>
              <CardDescription>
                Get actionable insights with AI-powered performance summaries and recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Performance Insights</Badge>
                <Badge variant="secondary">Lookalike Audiences</Badge>
                <Badge variant="secondary">Auto-tagging</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
