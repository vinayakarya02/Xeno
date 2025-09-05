import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const campaignsCol = db.collection("campaigns");
    const customersCol = db.collection("customers");
    const segmentsCol = db.collection("segments");

    // Total campaigns
    const totalCampaigns = await campaignsCol.countDocuments();
    // Total customers
    const totalCustomers = await customersCol.countDocuments();
    // Average delivery rate
    const deliveryAgg = await campaignsCol.aggregate([
      { $group: { _id: null, avgDelivery: { $avg: "$deliveryRate" } } }
    ]).toArray();
    const avgDeliveryRate = deliveryAgg[0]?.avgDelivery || 0;
    // Top 3 segments by audience size
    const topSegments = await segmentsCol.find({})
      .sort({ audienceSize: -1 })
      .limit(3)
      .toArray();
    // 5 most recent campaigns
    const recentCampaigns = await campaignsCol.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      totalCampaigns,
      totalCustomers,
      avgDeliveryRate,
      topSegments,
      recentCampaigns,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
} 