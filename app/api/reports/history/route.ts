import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getReportsByRestaurantId } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get reports from database
    const reports = await getReportsByRestaurantId(session.user.restaurantId)

    // If no reports in database yet, return mock data
    if (reports.length === 0) {
      const mockReports = generateMockReports()
      return NextResponse.json(
        {
          success: true,
          reports: mockReports,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        reports,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch reports" }, { status: 500 })
  }
}

function generateMockReports() {
  const types = ["sales", "inventory", "staff", "customers"]
  const formats = ["pdf", "csv", "excel"]
  const timeframes = ["Today", "This Week", "This Month", "Custom Range"]

  return Array.from({ length: 5 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const format = formats[Math.floor(Math.random() * formats.length)]
    const date = new Date()
    date.setDate(date.getDate() - i)

    return {
      id: `report-${i + 1}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${date.toLocaleDateString()}`,
      type,
      format,
      createdAt: date.toISOString(),
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}MB`,
    }
  })
}

