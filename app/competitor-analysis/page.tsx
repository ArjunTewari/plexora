import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CompetitorAnalysisTool } from "@/components/competitor-analysis/competitor-analysis-tool"

export const metadata: Metadata = {
  title: "Competitor Analysis | Plexora",
  description: "Analyze your competitors and benchmark your performance",
}

export default function CompetitorAnalysisPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Competitor Analysis" text="Analyze your competitors and benchmark your performance" />
      <div className="grid gap-4">
        <CompetitorAnalysisTool />
      </div>
    </DashboardShell>
  )
}

