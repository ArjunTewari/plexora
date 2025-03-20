"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

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

interface ForecastResultsProps {
  data: ForecastData
  period: "week" | "month" | "quarter"
}

export function ForecastResults({ data, period }: ForecastResultsProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  const isPositiveGrowth = Number.parseFloat(data.growthRate) >= 0
  const periodLabel = period === "week" ? "Weekly" : period === "month" ? "Monthly" : "Quarterly"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{periodLabel} Forecast Summary</CardTitle>
            <Badge variant="outline" className="ml-2">
              Confidence: {(Number.parseFloat(data.confidenceScore) * 100).toFixed(0)}%
            </Badge>
          </div>
          <CardDescription>
            Projected revenue: ${data.totalRevenue.toLocaleString()}
            <span className={`ml-2 inline-flex items-center ${isPositiveGrowth ? "text-green-500" : "text-red-500"}`}>
              {isPositiveGrowth ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(Number.parseFloat(data.growthRate) * 100).toFixed(1)}%
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${value}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  labelFormatter={(label: string) => formatDate(label)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {data.itemForecasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Menu Item Forecast</CardTitle>
            <CardDescription>Projected sales for top menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.itemForecasts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(value: number) => `${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value: number) => `$${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="projectedSales" name="Projected Units" fill="hsl(var(--primary))" />
                  <Bar
                    yAxisId="right"
                    dataKey="projectedRevenue"
                    name="Projected Revenue"
                    fill="hsl(var(--secondary))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

