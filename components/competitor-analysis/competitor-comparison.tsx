"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Competitor {
  id: string
  name: string
  location: string
  priceIndex: number
  popularItems: string[]
  strengths: string[]
  weaknesses: string[]
  lastUpdated: string
}

interface CompetitorComparisonProps {
  competitors: Competitor[]
}

export function CompetitorComparison({ competitors }: CompetitorComparisonProps) {
  const [metric, setMetric] = useState<"priceIndex" | "popularity" | "menu">("priceIndex")

  // Generate comparison data based on selected metric
  const getComparisonData = () => {
    if (metric === "priceIndex") {
      return [
        { name: "Your Restaurant", value: 1.0 },
        ...competitors.map((c) => ({ name: c.name, value: c.priceIndex })),
      ]
    } else if (metric === "popularity") {
      // In a real app, this would be actual popularity data
      return [
        { name: "Your Restaurant", value: 85 },
        ...competitors.map((c) => ({
          name: c.name,
          value: Math.floor(Math.random() * 50) + 50, // Mock data
        })),
      ]
    } else {
      // Menu variety comparison (using popularItems length as a proxy)
      return [
        { name: "Your Restaurant", value: 12 }, // Assuming your restaurant has 12 popular items
        ...competitors.map((c) => ({
          name: c.name,
          value: c.popularItems.length,
        })),
      ]
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="metric">Comparison Metric</Label>
          <Select value={metric} onValueChange={(value) => setMetric(value as any)}>
            <SelectTrigger id="metric">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priceIndex">Price Index</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="menu">Menu Variety</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ChartContainer
              config={{
                value: {
                  label:
                    metric === "priceIndex"
                      ? "Price Index"
                      : metric === "popularity"
                        ? "Popularity Score"
                        : "Menu Items",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getComparisonData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(value) => (metric === "priceIndex" ? value.toFixed(2) : value.toString())}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

