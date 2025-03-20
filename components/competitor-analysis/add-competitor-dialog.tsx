"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AddCompetitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: any) => void
}

export function AddCompetitorDialog({ open, onOpenChange, onAdd }: AddCompetitorDialogProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [priceIndex, setPriceIndex] = useState("1.0")
  const [popularItem, setPopularItem] = useState("")
  const [popularItems, setPopularItems] = useState<string[]>([])
  const [strengths, setStrengths] = useState("")
  const [weaknesses, setWeaknesses] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setName("")
    setLocation("")
    setPriceIndex("1.0")
    setPopularItem("")
    setPopularItems([])
    setStrengths("")
    setWeaknesses("")
  }

  function addPopularItem() {
    if (popularItem.trim() && !popularItems.includes(popularItem.trim())) {
      setPopularItems([...popularItems, popularItem.trim()])
      setPopularItem("")
    }
  }

  function removePopularItem(item: string) {
    setPopularItems(popularItems.filter((i) => i !== item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const competitorData = {
      name,
      location,
      priceIndex: Number.parseFloat(priceIndex),
      popularItems,
      strengths: strengths.split("\n").filter((s) => s.trim()),
      weaknesses: weaknesses.split("\n").filter((s) => s.trim()),
      lastUpdated: new Date().toISOString(),
    }

    await onAdd(competitorData)
    setIsSubmitting(false)
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Competitor</DialogTitle>
          <DialogDescription>Add a new competitor to track and analyze</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Competitor name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Address or area"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceIndex">Price Index (relative to your prices)</Label>
              <Input
                id="priceIndex"
                type="number"
                step="0.01"
                min="0.1"
                max="5"
                value={priceIndex}
                onChange={(e) => setPriceIndex(e.target.value)}
                placeholder="1.0 = same as your prices"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Popular Menu Items</Label>
              <div className="flex gap-2">
                <Input
                  value={popularItem}
                  onChange={(e) => setPopularItem(e.target.value)}
                  placeholder="Add popular item"
                />
                <Button type="button" onClick={addPopularItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {popularItems.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularItems.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removePopularItem(item)}
                        className="rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strengths">Strengths</Label>
                <Textarea
                  id="strengths"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="One strength per line"
                  className="h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weaknesses">Weaknesses</Label>
                <Textarea
                  id="weaknesses"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="One weakness per line"
                  className="h-20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Competitor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

