import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const client = await clientPromise
    const db = client.db()
    const ordersCollection = db.collection("orders")

    let query: any = {}
    if (customerId) {
      query.customerId = customerId
    }

    const total = await ordersCollection.countDocuments(query)
    const orders = await ordersCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { customerId, amount, items } = body
    if (!customerId || !amount || !items) {
      return NextResponse.json({ error: "Customer ID, amount, and items are required" }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db()
    const ordersCollection = db.collection("orders")
    const newOrder = {
      customerId,
      amount: Number.parseFloat(amount),
      date: body.date || new Date().toISOString().split("T")[0],
      status: body.status || "completed",
      items: Array.isArray(items) ? items : [items],
      userEmail: session.user?.email || null,
    }
    const result = await ordersCollection.insertOne(newOrder)
    return NextResponse.json({ ...newOrder, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
