"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { ForecastResults } from "@/components/forecasting/forecast-results"
import { useToast } from "@/hooks/use-toast"

interface ForecastData {
  totalRevenue: number
  averageDailyRevenue: number
  growthRate: string
  confidenceScore: string
  dailyForecast: {
    date: string
    revenue: number
    transactions: number
    averageTicket: number
  }[]
  itemForecasts: {
    itemId: string
    name: string
    projectedSales: number
    projectedRevenue: number
    growthRate: string
  }[]
}

export function ForecastingTool() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week")
  const [loading, setLoading] = useState(false)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const { toast } = useToast()

  async function generateForecast() {
    setLoading(true)

    try {
      const response = await fetch("/api/forecast-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ period }),
      })

      const result = await response.json()

      if (result.success) {
        setForecastData(result.forecast)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate forecast.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating forecast:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales Forecasting</CardTitle>
          <CardDescription>Generate AI-powered sales forecasts for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="week" onValueChange={(value) => setPeriod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Next Week</TabsTrigger>
                <TabsTrigger value="month">Next Month</TabsTrigger>
                <TabsTrigger value="quarter">Next Quarter</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={generateForecast} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Forecast...
                </>
              ) : (
                "Generate Forecast"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {forecastData && <ForecastResults data={forecastData} period={period} />}
    </div>
  )
}

