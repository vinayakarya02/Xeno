import { type NextRequest, NextResponse } from "next/server"

// Mock database for communication logs
const communicationLogs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, customerId, status, timestamp } = body

    if (!campaignId || !customerId || !status) {
      return NextResponse.json({ error: "Campaign ID, customer ID, and status are required" }, { status: 400 })
    }

    // Find and update the communication log
    const logIndex = communicationLogs.findIndex(
      (log) => log.campaignId === campaignId && log.customerId === customerId,
    )

    if (logIndex !== -1) {
      communicationLogs[logIndex].status = status
      communicationLogs[logIndex].deliveredAt = timestamp || new Date().toISOString()
    } else {
      // Create new log entry if not found
      communicationLogs.push({
        id: `${campaignId}-${customerId}`,
        campaignId,
        customerId,
        status,
        deliveredAt: timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
    }

    // In a real application, you might want to update campaign statistics here
    // or trigger other processes based on delivery status

    return NextResponse.json({
      success: true,
      message: "Delivery receipt processed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process delivery receipt" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    let filteredLogs = communicationLogs

    if (campaignId) {
      filteredLogs = communicationLogs.filter((log) => log.campaignId === campaignId)
    }

    return NextResponse.json({
      logs: filteredLogs,
      total: filteredLogs.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch delivery logs" }, { status: 500 })
  }
}
