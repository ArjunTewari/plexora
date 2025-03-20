"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface CustomerSegment {
  segment: string
  percentage: number
}

interface LabelProps {
  name: string
  percent: number
}

export function CustomerSegmentation() {
  const [data, setData] = useState<CustomerSegment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard-summary")
        const result = await response.json()

        if (result.success) {
          setData(result.data.customerSegmentation)
        }
      } catch (error) {
        console.error("Error fetching customer segmentation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const renderCustomLabel = ({ name, percent }: LabelProps) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Customer Segmentation</CardTitle>
        <CardDescription>Breakdown of your customer base</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full aspect-[2/1]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="segment"
                  label={renderCustomLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

