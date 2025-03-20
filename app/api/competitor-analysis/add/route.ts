import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCollection } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const competitorData = await req.json()

    // Validate input
    if (!competitorData.name || !competitorData.location) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Add restaurant ID to competitor data
    const competitor = {
      ...competitorData,
      restaurantId: session.user.restaurantId,
      createdAt: new Date(),
    }

    // Save to database
    const competitorsCollection = await getCollection("competitors")
    await competitorsCollection.insertOne(competitor)

    return NextResponse.json(
      {
        success: true,
        message: "Competitor added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding competitor:", error)
    return NextResponse.json({ success: false, message: "Failed to add competitor" }, { status: 500 })
  }
}

