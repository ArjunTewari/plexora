"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DataIntegrationTool() {
  const [file, setFile] = useState<File | null>(null)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // In a real implementation, we would use FormData to upload the file
    // const formData = new FormData();
    // formData.append("file", file);

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Upload successful",
        description: `Processed ${file.name} with 156 records.`,
      })

      setFile(null)
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleApiConnect(e: React.FormEvent) {
    e.preventDefault()

    if (!apiEndpoint || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please provide both API endpoint and API key.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Connection successful",
        description: "Your POS system has been connected successfully.",
      })
    } catch (error) {
      console.error("Error connecting API:", error)
      toast({
        title: "Connection failed",
        description: "There was an error connecting to your POS system. Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Integration</CardTitle>
        <CardDescription>Connect your POS system or upload data to RestaurantIQ</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="api">API Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="csv">Upload CSV File</Label>
                <div className="flex items-center gap-2">
                  <Input id="csv" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <Button type="submit" disabled={!file || loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Supported file format: CSV</p>
                <p>Maximum file size: 10MB</p>
                <p>Required columns: date, item_id, item_name, quantity, price, total</p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="api" className="mt-4">
            <form onSubmit={handleApiConnect} className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="endpoint">POS API Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.yourpos.com/v1/sales"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="apikey">API Key</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="Your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!apiEndpoint || !apiKey || loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect POS System"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Your data is securely processed and stored. We support integration with major POS systems including Toast,
        Square, Clover, and more.
      </CardFooter>
    </Card>
  )
}

