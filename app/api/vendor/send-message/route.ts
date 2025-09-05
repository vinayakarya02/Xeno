import { type NextRequest, NextResponse } from "next/server"

// Simulate a vendor API for sending messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, customerId, customerName, message, phone } = body

    if (!campaignId || !customerId || !message) {
      return NextResponse.json({ error: "Campaign ID, customer ID, and message are required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))

    // Simulate 90% success rate, 10% failure rate
    const isSuccess = Math.random() > 0.1
    const status = isSuccess ? "SENT" : "FAILED"

    // Simulate calling back to our delivery receipt API
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/delivery-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          customerId,
          status,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (callbackError) {
      console.error("Failed to send delivery receipt:", callbackError)
    }

    return NextResponse.json({
      success: isSuccess,
      status,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
