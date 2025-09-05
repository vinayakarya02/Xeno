import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const customersCollection = db.collection("customers");
    const customer = await customersCollection.findOne({ _id: new ObjectId(params.id) });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
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
    const customersCollection = db.collection("customers");
    const { name, email, phone, totalSpent, visits, lastVisit, orders, avgOrderValue } = body;
    const updateDoc: any = {};
    if (name) updateDoc.name = name;
    if (email) updateDoc.email = email;
    if (phone) updateDoc.phone = phone;
    if (totalSpent !== undefined) updateDoc.totalSpent = totalSpent;
    if (visits !== undefined) updateDoc.visits = visits;
    if (lastVisit) updateDoc.lastVisit = lastVisit;
    if (orders !== undefined) updateDoc.orders = orders;
    if (avgOrderValue !== undefined) updateDoc.avgOrderValue = avgOrderValue;
    updateDoc.updatedAt = new Date().toISOString();
    const result = await customersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateDoc }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    const updated = await customersCollection.findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
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
    const customersCollection = db.collection("customers");
    const result = await customersCollection.deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
} 