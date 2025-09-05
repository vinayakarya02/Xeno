import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const ordersCollection = db.collection("orders");
    const order = await ordersCollection.findOne({ _id: new ObjectId(params.id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
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
    const ordersCollection = db.collection("orders");
    const { customerId, amount, date, status, items } = body;
    const updateDoc: any = {};
    if (customerId) updateDoc.customerId = customerId;
    if (amount !== undefined) updateDoc.amount = Number.parseFloat(amount);
    if (date) updateDoc.date = date;
    if (status) updateDoc.status = status;
    if (items) updateDoc.items = Array.isArray(items) ? items : [items];
    updateDoc.updatedAt = new Date().toISOString();
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateDoc }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const updated = await ordersCollection.findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
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
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
} 