import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Convert natural language to rules
    const rules = parseNaturalLanguageQuery(query)

    return NextResponse.json({ rules })
  } catch (error) {
    return NextResponse.json({ error: "Failed to parse natural language query" }, { status: 500 })
  }
}

function parseNaturalLanguageQuery(query: string): any[] {
  const rules: any[] = []
  const lowerQuery = query.toLowerCase()

  // Simple pattern matching (in a real app, this would use advanced NLP/AI)

  // Pattern: "haven't shopped in X months"
  const monthsMatch = lowerQuery.match(/haven't shopped in (\d+) months?/)
  if (monthsMatch) {
    const months = Number.parseInt(monthsMatch[1])
    const days = months * 30
    rules.push({
      id: Date.now().toString(),
      field: "lastVisit",
      operator: ">",
      value: days.toString(),
    })
  }

  // Pattern: "spent over ₹X" or "spent more than ₹X"
  const spentMatch = lowerQuery.match(/spent (?:over|more than) ₹?(\d+)/)
  if (spentMatch) {
    const amount = spentMatch[1]
    rules.push({
      id: (Date.now() + 1).toString(),
      field: "totalSpent",
      operator: ">",
      value: amount,
      connector: rules.length > 0 ? "AND" : undefined,
    })
  }

  // Pattern: "less than X visits"
  const visitsMatch = lowerQuery.match(/less than (\d+) visits?/)
  if (visitsMatch) {
    const visits = visitsMatch[1]
    rules.push({
      id: (Date.now() + 2).toString(),
      field: "visits",
      operator: "<",
      value: visits,
      connector: rules.length > 0 ? "AND" : undefined,
    })
  }

  // Pattern: "more than X orders"
  const ordersMatch = lowerQuery.match(/more than (\d+) orders?/)
  if (ordersMatch) {
    const orders = ordersMatch[1]
    rules.push({
      id: (Date.now() + 3).toString(),
      field: "orders",
      operator: ">",
      value: orders,
      connector: rules.length > 0 ? "AND" : undefined,
    })
  }

  // Pattern: "inactive for X days"
  const inactiveMatch = lowerQuery.match(/inactive for (\d+) days?/)
  if (inactiveMatch) {
    const days = inactiveMatch[1]
    rules.push({
      id: (Date.now() + 4).toString(),
      field: "lastVisit",
      operator: ">",
      value: days,
      connector: rules.length > 0 ? "AND" : undefined,
    })
  }

  // If no patterns matched, return a default rule
  if (rules.length === 0) {
    rules.push({
      id: Date.now().toString(),
      field: "totalSpent",
      operator: ">",
      value: "1000",
    })
  }

  return rules
}
