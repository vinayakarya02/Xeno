import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Mock database - in a real app, this would be your actual database
const customers: any[] = [
  {
    id: "1",
    name: "Mohit Sharma",
    email: "mohit@example.com",
    phone: "+91-9876543210",
    totalSpent: 15000,
    visits: 12,
    lastVisit: "2024-01-10",
    orders: 8,
    avgOrderValue: 1875,
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91-9876543211",
    totalSpent: 8500,
    visits: 6,
    lastVisit: "2024-01-12",
    orders: 5,
    avgOrderValue: 1700,
    createdAt: "2023-08-20",
  },
]

const orders: any[] = [
  {
    id: "1",
    customerId: "1",
    amount: 2500,
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "2",
    customerId: "1",
    amount: 1800,
    date: "2024-01-05",
    status: "completed",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const client = await clientPromise
    const db = client.db()
    const customersCollection = db.collection("customers")

    let query: any = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    }

    const total = await customersCollection.countDocuments(query)
    const customers = await customersCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { name, email, phone } = body
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db()
    const customersCollection = db.collection("customers")
    // Check if customer already exists
    const existingCustomer = await customersCollection.findOne({ email })
    if (existingCustomer) {
      return NextResponse.json({ error: "Customer with this email already exists" }, { status: 409 })
    }
    const newCustomer = {
      name,
      email,
      phone,
      totalSpent: body.totalSpent || 0,
      visits: body.visits || 0,
      lastVisit: body.lastVisit || new Date().toISOString().split("T")[0],
      orders: body.orders || 0,
      avgOrderValue: body.avgOrderValue || 0,
      createdAt: new Date().toISOString().split("T")[0],
      userEmail: session.user?.email || null,
    }
    const result = await customersCollection.insertOne(newCustomer)
    return NextResponse.json({ ...newCustomer, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
