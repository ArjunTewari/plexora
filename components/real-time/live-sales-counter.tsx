"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { DollarSign } from "lucide-react"

export function LiveSalesCounter() {
  const { data: session } = useSession()
  const [sales, setSales] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const initializeSocket = async () => {
      // Make a request to the socket API route to initialize the connection
      await fetch("/api/socket")

      const socketInstance = io()
      setSocket(socketInstance)

      // Join the restaurant-specific room if we have a restaurantId
      if (session?.user?.restaurantId) {
        socketInstance.emit("join-restaurant", session.user.restaurantId)
      }

      // Listen for sales updates
      socketInstance.on("sales-update", (data) => {
        setSales(data.totalSales)
        setTransactions(data.totalTransactions)
      })

      // Clean up on unmount
      return () => {
        socketInstance.disconnect()
      }
    }

    if (session?.user?.restaurantId) {
      initializeSocket()
    }

    // For demo purposes, simulate real-time updates
    const interval = setInterval(() => {
      setSales((prev) => {
        const newValue = prev !== null ? prev + Math.floor(Math.random() * 50) : 1250
        return newValue
      })

      setTransactions((prev) => {
        const newValue = prev !== null ? prev + Math.floor(Math.random() * 3) : 42
        return newValue
      })

      setLoading(false)
    }, 5000)

    return () => {
      clearInterval(interval)
      if (socket) {
        socket.disconnect()
      }
    }
  }, [session])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Live Sales</CardTitle>
        <CardDescription>Real-time sales tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[40%]" />
              <Skeleton className="h-4 w-[20%]" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">${sales?.toLocaleString()}</span>
              <div className="flex items-center text-xs text-green-500">
                <span className="ml-1">Live</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Today's Transactions</span>
                <span className="font-medium text-foreground">{transactions}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

