"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RevenueData {
  date: string
  revenue: number
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard-summary")
        const result = await response.json()

        if (result.success) {
          setData(result.data.revenueByDay)
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
        <CardDescription>Daily revenue for the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full aspect-[2/1]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
        )}
      </CardContent>
    </Card>
  )
}

