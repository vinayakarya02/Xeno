import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const campaignsCollection = db.collection("campaigns");
    const campaign = await campaignsCollection.findOne({ _id: new ObjectId(params.id) });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    campaign._id = campaign._id.toString();
    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const campaignsCollection = db.collection("campaigns");
    const { name, message, rules, audienceSize, status } = body;
    const updateDoc: any = {};
    if (name) updateDoc.name = name;
    if (message) updateDoc.message = message;
    if (rules) updateDoc.rules = rules;
    if (audienceSize !== undefined) updateDoc.audienceSize = audienceSize;
    if (status) updateDoc.status = status;
    updateDoc.updatedAt = new Date().toISOString();
    const result = await campaignsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateDoc }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    const updated = await campaignsCollection.findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const campaignsCollection = db.collection("campaigns");
    const result = await campaignsCollection.deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
} 