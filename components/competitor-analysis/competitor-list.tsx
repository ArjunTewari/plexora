"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, RefreshCw, Trash, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
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

interface CompetitorListProps {
  competitors: Competitor[]
  onRefresh: () => void
}

export function CompetitorList({ competitors, onRefresh }: CompetitorListProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get price index color
  const getPriceIndexColor = (index: number) => {
    if (index < 0.9) return "text-green-500"
    if (index > 1.1) return "text-red-500"
    return "text-yellow-500"
  }

  async function handleDelete(id: string) {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/competitor-analysis/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Competitor deleted",
          description: "The competitor has been removed from your list.",
        })

        // Refresh the competitor list
        onRefresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete competitor.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting competitor:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {competitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No competitors added yet.</p>
          <p className="text-sm text-muted-foreground">Add your first competitor to start tracking.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price Index</TableHead>
              <TableHead>Popular Items</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor) => (
              <TableRow key={competitor.id}>
                <TableCell className="font-medium">{competitor.name}</TableCell>
                <TableCell>{competitor.location}</TableCell>
                <TableCell>
                  <span className={getPriceIndexColor(competitor.priceIndex)}>{competitor.priceIndex.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {competitor.popularItems.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline">
                        {item}
                      </Badge>
                    ))}
                    {competitor.popularItems.length > 3 && (
                      <Badge variant="outline">+{competitor.popularItems.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(competitor.lastUpdated)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(competitor.id)}
                        disabled={isDeleting === competitor.id}
                      >
                        {isDeleting === competitor.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

