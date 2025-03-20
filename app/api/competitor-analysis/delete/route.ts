import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, message: "Competitor ID is required" }, { status: 400 })
    }

    // Delete from database
    const competitorsCollection = await getCollection("competitors")
    const result = await competitorsCollection.deleteOne({
      _id: new ObjectId(id),
      restaurantId: session.user.restaurantId, // Ensure user can only delete their own competitors
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Competitor not found or not authorized to delete" },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Competitor deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting competitor:", error)
    return NextResponse.json({ success: false, message: "Failed to delete competitor" }, { status: 500 })
  }
}

