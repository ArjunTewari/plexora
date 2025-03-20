"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CompetitorList } from "@/components/competitor-analysis/competitor-list"
import { CompetitorComparison } from "@/components/competitor-analysis/competitor-comparison"
import { AddCompetitorDialog } from "@/components/competitor-analysis/add-competitor-dialog"

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

export function CompetitorAnalysisTool() {
  const [activeTab, setActiveTab] = useState<"list" | "comparison">("list")
  const [loading, setLoading] = useState(true)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCompetitors()
  }, [])

  async function fetchCompetitors() {
    setLoading(true)

    try {
      const response = await fetch("/api/competitor-analysis/list")
      const result = await response.json()

      if (result.success) {
        setCompetitors(result.competitors)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch competitors.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching competitors:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCompetitor(competitorData: any) {
    try {
      const response = await fetch("/api/competitor-analysis/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitorData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Competitor added",
          description: "The competitor has been added successfully.",
        })

        // Refresh the competitor list
        fetchCompetitors()
        setIsAddDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add competitor.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding competitor:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Competitor Analysis</CardTitle>
            <CardDescription>Track and analyze your competitors to stay ahead</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Competitor
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Competitor List</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <CompetitorList competitors={competitors} onRefresh={fetchCompetitors} />
              )}
            </TabsContent>

            <TabsContent value="comparison" className="mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <CompetitorComparison competitors={competitors} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddCompetitorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddCompetitor} />
    </div>
  )
}

