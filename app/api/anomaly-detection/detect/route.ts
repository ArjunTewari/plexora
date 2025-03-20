import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { saveAnomalyDetection } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { timeframe, sensitivity } = await req.json()

    if (!timeframe || !sensitivity) {
      return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 })
    }

    // In a real implementation, this would:
    // 1. Retrieve sales data for the specified timeframe
    // 2. Apply anomaly detection algorithms
    // 3. Save and return the detected anomalies

    // For demo purposes, we'll generate mock anomalies
    const anomalies = generateMockAnomalies(timeframe, sensitivity)

    // Save anomalies to database
    for (const anomaly of anomalies) {
      await saveAnomalyDetection({
        ...anomaly,
        restaurantId: session.user.restaurantId,
        createdAt: new Date(),
      })
    }

    // For complex anomalies, we could use AI to generate explanations
    if (anomalies.length > 0) {
      const anomalyData = JSON.stringify(anomalies)

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system:
          "You are an AI analyst specializing in restaurant data. Analyze these anomalies and provide a brief, insightful explanation.",
        prompt: `Analyze these anomalies in restaurant data and provide a brief explanation of what might be causing them: ${anomalyData}`,
      })

      // In a real implementation, we would save this analysis
      console.log("AI Analysis:", text)
    }

    return NextResponse.json(
      {
        success: true,
        anomalies,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error detecting anomalies:", error)
    return NextResponse.json({ success: false, message: "Failed to detect anomalies" }, { status: 500 })
  }
}

function generateMockAnomalies(timeframe: string, sensitivity: string) {
  // Generate different numbers of anomalies based on sensitivity
  const count = sensitivity === "high" ? 5 : sensitivity === "medium" ? 3 : 1

  const anomalyTypes = [
    "Sales Spike",
    "Sales Drop",
    "Inventory Discrepancy",
    "Order Cancellation Rate",
    "Average Order Value",
    "Customer Wait Time",
    "Staff Productivity",
  ]

  const descriptions = [
    "Unusual increase in sales compared to historical data",
    "Significant drop in sales compared to expected values",
    "Inventory levels don't match sales records",
    "Higher than normal order cancellation rate",
    "Unusual change in average order value",
    "Customer wait times significantly longer than normal",
    "Staff productivity metrics show unusual patterns",
  ]

  // Generate random anomalies
  return Array.from({ length: count }, (_, i) => {
    const typeIndex = Math.floor(Math.random() * anomalyTypes.length)
    const now = new Date()

    // Adjust detection time based on timeframe
    const detectionDate = new Date(now)
    if (timeframe === "week") {
      detectionDate.setDate(now.getDate() - Math.floor(Math.random() * 7))
    } else if (timeframe === "month") {
      detectionDate.setDate(now.getDate() - Math.floor(Math.random() * 30))
    } else {
      detectionDate.setHours(now.getHours() - Math.floor(Math.random() * 24))
    }

    const value = Math.floor(Math.random() * 1000) + 100
    const expectedMin = Math.floor(value * 0.7)
    const expectedMax = Math.floor(value * 1.3)

    return {
      id: `anomaly-${Date.now()}-${i}`,
      type: anomalyTypes[typeIndex],
      description: descriptions[typeIndex],
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
      detectedAt: detectionDate.toISOString(),
      affectedMetric: anomalyTypes[typeIndex].toLowerCase().replace(/\s+/g, "_"),
      value,
      expectedRange: {
        min: expectedMin,
        max: expectedMax,
      },
    }
  })
}

