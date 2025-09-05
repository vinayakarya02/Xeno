"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Users, Sparkles, Eye } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Rule {
  id: string
  field: string
  operator: string
  value: string
  connector?: "AND" | "OR"
}

export default function CreateCampaignPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState<Rule[]>([{ id: "1", field: "totalSpent", operator: ">", value: "10000" }]);
  const [audienceSize, setAudienceSize] = useState(0);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fieldOptions = [
    { value: "totalSpent", label: "Total Spent (₹)" },
    { value: "visits", label: "Number of Visits" },
    { value: "lastVisit", label: "Days Since Last Visit" },
    { value: "orders", label: "Number of Orders" },
    { value: "avgOrderValue", label: "Average Order Value (₹)" },
  ]

  const operatorOptions = [
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: ">=", label: "Greater than or equal" },
    { value: "<=", label: "Less than or equal" },
    { value: "=", label: "Equal to" },
    { value: "!=", label: "Not equal to" },
  ]

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      field: "totalSpent",
      operator: ">",
      value: "",
      connector: "AND",
    }
    setRules([...rules, newRule])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const previewAudience = async () => {
    // Simulate API call to get audience size
    const mockSize = Math.floor(Math.random() * 1000) + 100
    setAudienceSize(mockSize)
  }

  const generateAIMessage = async () => {
    // Simulate AI message generation
    const suggestions = [
      "Hi {name}, here's 10% off on your next order! 🎉",
      "Hey {name}! We miss you. Come back for exclusive deals! 💝",
      "Special offer for you, {name}! Get 15% off your favorite items! ✨",
    ]
    setAiSuggestions(suggestions)
  }

  const convertNaturalLanguage = async () => {
    // Simulate AI conversion of natural language to rules
    if (naturalLanguageQuery.toLowerCase().includes("haven't shopped") && naturalLanguageQuery.includes("months")) {
      const newRules: Rule[] = [
        { id: "lastVisit", field: "lastVisit", operator: ">", value: "180" },
        { id: "totalSpent", field: "totalSpent", operator: ">", value: "5000", connector: "AND" },
      ]
      setRules(newRules)
    }
  }

  const handleCreateCampaign = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName,
          message,
          rules,
          audienceSize,
        }),
      });
      if (res.ok) {
        setSuccess("Campaign created successfully!");
        setTimeout(() => router.push("/campaigns"), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create campaign");
      }
    } catch (err) {
      setError("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName,
          message,
          rules,
          audienceSize,
          status: "draft",
        }),
      });
      if (res.ok) {
        setSuccess("Campaign saved as draft!");
        setTimeout(() => router.push("/campaigns"), 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save draft");
      }
    } catch (err) {
      setError("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to create a campaign.</div>;

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
              <Link href="/campaigns" className="text-gray-500 hover:text-gray-900">
                Campaigns
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Build your audience segment and craft personalized messages</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., Win-back High Value Customers"
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Natural Language Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  AI-Powered Segment Builder
                </CardTitle>
                <CardDescription>Describe your audience in plain English and let AI create the rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="naturalLanguage">Describe Your Audience</Label>
                  <Textarea
                    id="naturalLanguage"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                    placeholder="e.g., People who haven't shopped in 6 months and spent over ₹5K"
                    rows={3}
                  />
                </div>
                <Button onClick={convertNaturalLanguage} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Convert to Rules
                </Button>
              </CardContent>
            </Card>

            {/* Rule Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Rules</CardTitle>
                <CardDescription>Define your target audience with flexible conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="space-y-4">
                    {index > 0 && (
                      <div className="flex items-center space-x-2">
                        <Select
                          value={rule.connector}
                          onValueChange={(value) => updateRule(rule.id, "connector", value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Select value={rule.field} onValueChange={(value) => updateRule(rule.id, "field", value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, "operator", value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                        placeholder="Value"
                        className="w-32"
                      />

                      {rules.length > 1 && (
                        <Button variant="outline" size="icon" onClick={() => removeRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addRule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </CardContent>
            </Card>

            {/* Message Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  AI Message Generator
                </CardTitle>
                <CardDescription>Create personalized messages with AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateAIMessage} variant="outline" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Suggestions
                </Button>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label>AI Suggestions:</Label>
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label htmlFor="message">Campaign Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi {name}, here's 10% off on your next order!"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">Use {"{name}"} for personalization</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audience Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Audience Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={previewAudience} variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Audience
                </Button>

                {audienceSize > 0 && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{audienceSize.toLocaleString()}</div>
                    <div className="text-sm text-blue-600">customers match your criteria</div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Current Rules:</h4>
                  {rules.map((rule, index) => (
                    <div key={rule.id} className="text-sm">
                      {index > 0 && <span className="text-gray-500">{rule.connector} </span>}
                      <Badge variant="outline">
                        {fieldOptions.find((f) => f.value === rule.field)?.label} {rule.operator} {rule.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Launch Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={handleCreateCampaign} disabled={loading}>
                  {loading ? "Creating..." : "Create & Send Campaign"}
                </Button>
                {error && <div className="text-red-500 text-center">{error}</div>}
                {success && <div className="text-green-600 text-center">{success}</div>}
                <Button variant="outline" className="w-full" disabled={loading} onClick={handleSaveDraft}>
                  {loading ? "Saving..." : "Save as Draft"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Campaign will be sent immediately to all matching customers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
