import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

// Mock database for campaigns
const campaigns: any[] = []
const communicationLogs: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const client = await clientPromise
    const db = client.db()
    const campaignsCollection = db.collection("campaigns")

    const total = await campaignsCollection.countDocuments()
    const campaigns = await campaignsCollection
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const campaignsWithStringId = campaigns.map(c => ({ ...c, _id: c._id.toString() }))
    return NextResponse.json({
      campaigns: campaignsWithStringId,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("API /api/campaigns GET error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, message, rules, audienceSize, status } = body
    if (!name || !message || !rules) {
      return NextResponse.json({ error: "Name, message, and rules are required" }, { status: 400 })
    }
    const newCampaign = {
      name,
      message,
      rules,
      audienceSize: audienceSize || 0,
      status: status || "sending",
      sent: 0,
      failed: 0,
      deliveryRate: 0,
      createdAt: new Date().toISOString(),
      tags: generateCampaignTags(name, message),
      userEmail: session.user?.email || null,
    }
    const client = await clientPromise
    const db = client.db()
    const campaignsCollection = db.collection("campaigns")
    const result = await campaignsCollection.insertOne(newCampaign)
    // Only trigger delivery if not draft
    if (newCampaign.status !== "draft") {
      processCampaignDeliveryMongo(result.insertedId.toString())
    }
    return NextResponse.json({ ...newCampaign, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("API /api/campaigns POST error:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}

// AI-powered campaign tagging
function generateCampaignTags(name: string, message: string): string[] {
  const tags: string[] = []
  const text = (name + " " + message).toLowerCase()

  // Simple keyword-based tagging (in a real app, this would use AI)
  if (text.includes("win-back") || text.includes("miss you") || text.includes("come back")) {
    tags.push("Win-back")
  }
  if (text.includes("high value") || text.includes("vip") || text.includes("premium")) {
    tags.push("High Value")
  }
  if (text.includes("new") || text.includes("launch") || text.includes("introducing")) {
    tags.push("Product Launch")
  }
  if (text.includes("inactive") || text.includes("re-engagement")) {
    tags.push("Re-engagement")
  }
  if (text.includes("appreciation") || text.includes("thank")) {
    tags.push("Appreciation")
  }

  return tags.length > 0 ? tags : ["General"]
}

// Simulate campaign delivery
async function processCampaignDelivery(campaignId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId)
  if (!campaign) return

  const audienceSize = campaign.audienceSize || Math.floor(Math.random() * 1000) + 100
  let sent = 0
  let failed = 0

  // Simulate delivery to each customer
  for (let i = 0; i < audienceSize; i++) {
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      sent++
    } else {
      failed++
    }

    // Log each delivery attempt
    communicationLogs.push({
      id: `${campaignId}-${i}`,
      campaignId,
      customerId: `customer-${i}`,
      status: isSuccess ? "SENT" : "FAILED",
      timestamp: new Date().toISOString(),
      message: campaign.message,
    })
  }

  // Update campaign status
  campaign.sent = sent
  campaign.failed = failed
  campaign.deliveryRate = (sent / audienceSize) * 100
  campaign.status = "sent"
  campaign.audienceSize = audienceSize
}

async function processCampaignDeliveryMongo(campaignId: string) {
  const client = await clientPromise;
  const db = client.db();
  const campaignsCollection = db.collection("campaigns");
  const campaign = await campaignsCollection.findOne({ _id: campaignId.length === 24 ? new (require('mongodb').ObjectId)(campaignId) : campaignId });
  if (!campaign) return;
  const audienceSize = campaign.audienceSize || Math.floor(Math.random() * 1000) + 100;
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < audienceSize; i++) {
    const isSuccess = Math.random() > 0.1;
    if (isSuccess) sent++;
    else failed++;
    // (Optional: log each delivery attempt)
  }
  const deliveryRate = audienceSize > 0 ? (sent / audienceSize) * 100 : 0;
  await campaignsCollection.updateOne(
    { _id: campaignId.length === 24 ? new (require('mongodb').ObjectId)(campaignId) : campaignId },
    {
      $set: {
        sent,
        failed,
        deliveryRate,
        audienceSize,
        status: "sent",
      },
    }
  );
}
