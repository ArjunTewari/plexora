"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface CompetitorData {
  name: string
  priceIndex: number
  popularItems: string[]
}

export function CompetitorInsights() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard-summary")
        const result = await response.json()

        if (result.success) {
          setCompetitors(result.data.competitorInsights)
        }
      } catch (error) {
        console.error("Error fetching competitor insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Competitor Insights</CardTitle>
        <CardDescription>Market positioning and popular items</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[40%]" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-[20%]" />
                  <Skeleton className="h-4 w-[20%]" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {competitors.map((competitor) => (
              <div key={competitor.name} className="space-y-2">
                <h3 className="font-medium">{competitor.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={competitor.priceIndex > 1 ? "default" : "secondary"}>
                    Price Index: {competitor.priceIndex.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Popular items: {competitor.popularItems.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

