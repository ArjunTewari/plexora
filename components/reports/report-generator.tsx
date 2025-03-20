"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"

export function ReportGenerator() {
  const [reportType, setReportType] = useState<"sales" | "inventory" | "staff" | "customers">("sales")
  const [format, setFormat] = useState<"pdf" | "csv" | "excel">("pdf")
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "custom">("week")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState({
    summary: true,
    charts: true,
    details: true,
    recommendations: true,
  })
  const { toast } = useToast()

  async function generateReport() {
    setLoading(true)

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          format,
          timeframe,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          sections,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      // For PDF format, we need to get the blob and create a download link
      if (format === "pdf") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      } else {
        // For other formats, we can parse the JSON response
        const result = await response.json()

        if (result.success) {
          // In a real app, this would handle the download URL from the response
          toast({
            title: "Report generated",
            description: `Your ${reportType} report has been generated and is ready to download.`,
          })

          // Simulate download for demo
          setTimeout(() => {
            const a = document.createElement("a")
            a.href = "#"
            a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            a.remove()
          }, 1000)
        } else {
          throw new Error(result.message || "Failed to generate report")
        }
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "An error occurred while generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>Create custom reports and export them in your preferred format</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="sales" onValueChange={(value) => setReportType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as any)}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Time Period</Label>
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeframe === "custom" && (
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex items-center gap-2">
                  <DatePicker date={startDate} setDate={setStartDate} />
                  <span>to</span>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Include Sections</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={sections.summary}
                  onCheckedChange={(checked) => setSections({ ...sections, summary: checked as boolean })}
                />
                <label
                  htmlFor="summary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Summary
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={sections.charts}
                  onCheckedChange={(checked) => setSections({ ...sections, charts: checked as boolean })}
                />
                <label
                  htmlFor="charts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Charts & Graphs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="details"
                  checked={sections.details}
                  onCheckedChange={(checked) => setSections({ ...sections, details: checked as boolean })}
                />
                <label
                  htmlFor="details"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Detailed Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={sections.recommendations}
                  onCheckedChange={(checked) => setSections({ ...sections, recommendations: checked as boolean })}
                />
                <label
                  htmlFor="recommendations"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  AI Recommendations
                </label>
              </div>
            </div>
          </div>

          <Button onClick={generateReport} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Generate & Download Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

