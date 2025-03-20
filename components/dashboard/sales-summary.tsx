"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"

interface SalesSummaryData {
  today: number
  yesterday: number
  thisWeek: number
  thisMonth: number
  changePercentage: string
}

export function SalesSummary() {
  const [data, setData] = useState<SalesSummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard-summary")
        const result = await response.json()

        if (result.success) {
          setData(result.data.salesSummary)
        }
      } catch (error) {
        console.error("Error fetching sales summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isPositiveChange = data ? Number.parseFloat(data.changePercentage) >= 0 : false

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Sales Summary</CardTitle>
        <CardDescription>Daily and monthly sales overview</CardDescription>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[30%]" />
              <Skeleton className="h-4 w-[30%]" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[40%]" />
              <Skeleton className="h-4 w-[20%]" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">${data.today.toLocaleString()}</span>
              <div className={`flex items-center text-xs ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
                {isPositiveChange ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(Number.parseFloat(data.changePercentage) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex flex-col">
                <span>Yesterday</span>
                <span className="font-medium text-foreground">${data.yesterday.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span>This Week</span>
                <span className="font-medium text-foreground">${data.thisWeek.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span>This Month</span>
                <span className="font-medium text-foreground">${data.thisMonth.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

