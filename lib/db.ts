import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Database and collection names
const DB_NAME = "plexora"
const COLLECTIONS = {
  USERS: "users",
  RESTAURANTS: "restaurants",
  SALES: "sales",
  MENU_ITEMS: "menuItems",
  COMPETITORS: "competitors",
  ANOMALIES: "anomalies",
  REPORTS: "reports",
}

// Helper function to get a collection
export async function getCollection(collectionName: string) {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return db.collection(collectionName)
}

// User functions
export async function getUserByEmail(email: string) {
  const usersCollection = await getCollection(COLLECTIONS.USERS)
  return usersCollection.findOne({ email })
}

export async function createUser(userData: any) {
  const usersCollection = await getCollection(COLLECTIONS.USERS)
  return usersCollection.insertOne(userData)
}

// Restaurant functions
export async function getRestaurantById(id: string) {
  const restaurantsCollection = await getCollection(COLLECTIONS.RESTAURANTS)
  return restaurantsCollection.findOne({ _id: new ObjectId(id) })
}

export async function getRestaurantsByUserId(userId: string) {
  const restaurantsCollection = await getCollection(COLLECTIONS.RESTAURANTS)
  return restaurantsCollection.find({ userId }).toArray()
}

// Sales functions
export async function getSalesByRestaurantId(restaurantId: string, startDate?: Date, endDate?: Date) {
  const salesCollection = await getCollection(COLLECTIONS.SALES)

  const query: any = { restaurantId }
  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = startDate
    if (endDate) query.date.$lte = endDate
  }

  return salesCollection.find(query).toArray()
}

export async function insertSalesData(salesData: any[]) {
  const salesCollection = await getCollection(COLLECTIONS.SALES)
  return salesCollection.insertMany(salesData)
}

// Menu items functions
export async function getMenuItemsByRestaurantId(restaurantId: string) {
  const menuItemsCollection = await getCollection(COLLECTIONS.MENU_ITEMS)
  return menuItemsCollection.find({ restaurantId }).toArray()
}

// Competitor functions
export async function getCompetitorsByRestaurantId(restaurantId: string) {
  const competitorsCollection = await getCollection(COLLECTIONS.COMPETITORS)
  return competitorsCollection.find({ restaurantId }).toArray()
}

export async function updateCompetitor(id: string, data: any) {
  const competitorsCollection = await getCollection(COLLECTIONS.COMPETITORS)
  return competitorsCollection.updateOne({ _id: new ObjectId(id) }, { $set: data })
}

// Anomaly functions
export async function saveAnomalyDetection(anomalyData: any) {
  const anomaliesCollection = await getCollection(COLLECTIONS.ANOMALIES)
  return anomaliesCollection.insertOne(anomalyData)
}

export async function getAnomaliesByRestaurantId(restaurantId: string, limit = 10) {
  const anomaliesCollection = await getCollection(COLLECTIONS.ANOMALIES)
  return anomaliesCollection.find({ restaurantId }).sort({ detectedAt: -1 }).limit(limit).toArray()
}

// Report functions
export async function saveReport(reportData: any) {
  const reportsCollection = await getCollection(COLLECTIONS.REPORTS)
  return reportsCollection.insertOne(reportData)
}

export async function getReportsByRestaurantId(restaurantId: string) {
  const reportsCollection = await getCollection(COLLECTIONS.REPORTS)
  return reportsCollection.find({ restaurantId }).sort({ createdAt: -1 }).toArray()
}

