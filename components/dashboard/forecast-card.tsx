"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ForecastData {
  totalRevenue: number
  averageDailyRevenue: number
  growthRate: string
  confidenceScore: string
}

export function ForecastCard() {
  const [data, setData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/forecast-sales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ period: "week" }),
        })

        const result = await response.json()

        if (result.success) {
          setData(result.forecast)
        }
      } catch (error) {
        console.error("Error fetching forecast data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isPositiveGrowth = data ? Number.parseFloat(data.growthRate) >= 0 : false

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Weekly Forecast</CardTitle>
        <CardDescription>Predicted sales for next 7 days</CardDescription>
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
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</span>
              <div className={`flex items-center text-xs ${isPositiveGrowth ? "text-green-500" : "text-red-500"}`}>
                {isPositiveGrowth ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(Number.parseFloat(data.growthRate) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex flex-col">
                <span>Daily Average</span>
                <span className="font-medium text-foreground">${data.averageDailyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span>Confidence</span>
                <span className="font-medium text-foreground">
                  {(Number.parseFloat(data.confidenceScore) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/forecasting">View Details</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

