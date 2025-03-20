import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser, getUserByEmail, getCollection } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, restaurantName } = await req.json()

    // Validate input
    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create restaurant
    const restaurantsCollection = await getCollection("restaurants")
    const restaurantResult = await restaurantsCollection.insertOne({
      name: restaurantName,
      createdAt: new Date(),
    })

    // Create user with restaurant ID
    const user = {
      name,
      email,
      password: hashedPassword,
      role: "owner", // Default role
      restaurantId: restaurantResult.insertedId.toString(),
      createdAt: new Date(),
    }

    await createUser(user)

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Failed to register user" }, { status: 500 })
  }
}

