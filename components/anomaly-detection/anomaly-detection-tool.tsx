"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AnomalyResults } from "@/components/anomaly-detection/anomaly-results"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Anomaly {
  id: string
  type: string
  description: string
  severity: "low" | "medium" | "high"
  detectedAt: string
  affectedMetric: string
  value: number
  expectedRange: {
    min: number
    max: number
  }
}

export function AnomalyDetectionTool() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week")
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high">("medium")
  const [loading, setLoading] = useState(false)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const { toast } = useToast()

  // Load existing anomalies on first render
  useEffect(() => {
    if (isFirstLoad) {
      fetchAnomalies()
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])

  async function fetchAnomalies() {
    setLoading(true)

    try {
      const response = await fetch("/api/anomaly-detection/list")
      const result = await response.json()

      if (result.success) {
        setAnomalies(result.anomalies)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch anomalies.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching anomalies:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function detectAnomalies() {
    setLoading(true)

    try {
      const response = await fetch("/api/anomaly-detection/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timeframe, sensitivity }),
      })

      const result = await response.json()

      if (result.success) {
        setAnomalies(result.anomalies)

        if (result.anomalies.length === 0) {
          toast({
            title: "No anomalies detected",
            description: "Your data looks normal for the selected timeframe.",
          })
        } else {
          toast({
            title: `${result.anomalies.length} anomalies detected`,
            description: "Review the findings below for more details.",
          })
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to detect anomalies.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error detecting anomalies:", error)
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
          <CardTitle>Anomaly Detection</CardTitle>
          <CardDescription>Automatically detect unusual patterns and outliers in your restaurant data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Last 24 Hours</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Detection Sensitivity</Label>
                <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as any)}>
                  <SelectTrigger id="sensitivity">
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (fewer alerts)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (more alerts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={detectAnomalies} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Detect Anomalies
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {anomalies.length > 0 && <AnomalyResults anomalies={anomalies} />}
    </div>
  )
}

