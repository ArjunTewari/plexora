import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAnomaliesByRestaurantId } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get anomalies from database
    const anomalies = await getAnomaliesByRestaurantId(session.user.restaurantId)

    return NextResponse.json(
      {
        success: true,
        anomalies,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching anomalies:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch anomalies" }, { status: 500 })
  }
}

