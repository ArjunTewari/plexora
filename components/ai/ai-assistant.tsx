"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AIAssistant() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!query.trim()) {
      toast({
        title: "Query is empty",
        description: "Please enter a question to ask the AI assistant.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setResponse("")

    try {
      const result = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await result.json()

      if (data.success) {
        setResponse(data.response)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to get a response from the AI assistant.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error asking AI:", error)
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant
        </CardTitle>
        <CardDescription>Ask questions about your restaurant data and get AI-powered insights</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Ask a question like 'What are my top selling items on weekends?' or 'Predict sales for next week'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ask AI Assistant
              </>
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Response:</h3>
            <div className="whitespace-pre-line text-sm">{response}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        The AI assistant analyzes your restaurant data to provide insights and recommendations.
      </CardFooter>
    </Card>
  )
}

