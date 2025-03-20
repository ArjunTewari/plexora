"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TopSellingItem {
  id: string
  name: string
  quantity: number
  revenue: number
}

export function TopSellingItems() {
  const [items, setItems] = useState<TopSellingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard-summary")
        const result = await response.json()

        if (result.success) {
          setItems(result.data.topSellingItems)
        }
      } catch (error) {
        console.error("Error fetching top selling items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top Selling Items</CardTitle>
        <CardDescription>Your best performing menu items</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[20%]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({item.quantity})</span>
                </div>
                <span className="font-medium">${item.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

