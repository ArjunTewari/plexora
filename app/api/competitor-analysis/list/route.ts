import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCompetitorsByRestaurantId } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get competitors from database
    const competitors = await getCompetitorsByRestaurantId(session.user.restaurantId)

    // If no competitors in database yet, return mock data
    if (competitors.length === 0) {
      const mockCompetitors = generateMockCompetitors()
      return NextResponse.json(
        {
          success: true,
          competitors: mockCompetitors,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        competitors,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching competitors:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch competitors" }, { status: 500 })
  }
}

function generateMockCompetitors() {
  return [
    {
      id: "comp-1",
      name: "Bistro Deluxe",
      location: "123 Main St",
      priceIndex: 1.15,
      popularItems: ["Steak Frites", "Truffle Pasta", "Crème Brûlée"],
      strengths: ["Upscale ambiance", "Wine selection", "Dessert menu"],
      weaknesses: ["Limited vegetarian options", "Long wait times", "Expensive"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "comp-2",
      name: "Urban Eats",
      location: "456 Oak Ave",
      priceIndex: 0.85,
      popularItems: ["Gourmet Burger", "Loaded Fries", "Craft Beer"],
      strengths: ["Fast service", "Casual atmosphere", "Good value"],
      weaknesses: ["Limited seating", "Noisy", "Basic menu"],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "comp-3",
      name: "Spice Garden",
      location: "789 Elm Blvd",
      priceIndex: 0.95,
      popularItems: ["Curry Platter", "Naan Bread", "Mango Lassi"],
      strengths: ["Unique flavors", "Vegetarian options", "Delivery service"],
      weaknesses: ["Small portions", "Inconsistent quality", "Limited hours"],
      lastUpdated: new Date().toISOString(),
    },
  ]
}

