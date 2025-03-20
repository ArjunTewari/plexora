import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AIAssistant } from "@/components/ai/ai-assistant"

export const metadata: Metadata = {
  title: "AI Assistant | RestaurantIQ",
  description: "Ask questions and get AI-powered insights about your restaurant data",
}

export default function AIAssistantPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Assistant"
        text="Ask questions about your restaurant data and get AI-powered insights"
      />
      <div className="grid gap-4">
        <AIAssistant />
      </div>
    </DashboardShell>
  )
}

