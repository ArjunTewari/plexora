"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface AnomalyResultsProps {
  anomalies: Anomaly[]
}

export function AnomalyResults({ anomalies }: AnomalyResultsProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Get badge color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Detected Anomalies</CardTitle>
        </div>
        <CardDescription>{anomalies.length} unusual patterns detected in your data</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Detected At</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Expected Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalies.map((anomaly) => (
              <TableRow key={anomaly.id}>
                <TableCell className="font-medium">{anomaly.type}</TableCell>
                <TableCell>{anomaly.description}</TableCell>
                <TableCell>{formatDate(anomaly.detectedAt)}</TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(anomaly.severity) as any}>{anomaly.severity}</Badge>
                </TableCell>
                <TableCell>{anomaly.value}</TableCell>
                <TableCell>
                  {anomaly.expectedRange.min} - {anomaly.expectedRange.max}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

