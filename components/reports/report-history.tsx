"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileDown, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  name: string
  type: "sales" | "inventory" | "staff" | "customers"
  format: "pdf" | "csv" | "excel"
  createdAt: string
  timeframe: string
  size: string
}

export function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    setLoading(true)

    try {
      const response = await fetch("/api/reports/history")
      const result = await response.json()

      if (result.success) {
        setReports(result.reports)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch report history.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function downloadReport(id: string, format: string) {
    setDownloading(id)

    try {
      // In a real app, this would fetch the report file
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate download
      const a = document.createElement("a")
      a.href = "#"
      a.download = `report-${id}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast({
        title: "Download started",
        description: "Your report download has started.",
      })
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(null)
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Get badge color based on report type
  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "sales":
        return "default"
      case "inventory":
        return "secondary"
      case "staff":
        return "outline"
      case "customers":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No reports generated yet.</p>
            <p className="text-sm text-muted-foreground">Generate your first report using the form above.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant={getReportTypeBadge(report.type) as any}>{report.type}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell className="uppercase">{report.format}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadReport(report.id, report.format)}
                      disabled={downloading === report.id}
                    >
                      {downloading === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

