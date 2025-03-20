import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportGenerator } from "@/components/reports/report-generator"
import { ReportHistory } from "@/components/reports/report-history"

export const metadata: Metadata = {
  title: "Reports | Plexora",
  description: "Generate and export custom reports for your restaurant",
}

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports" text="Generate and export custom reports for your restaurant" />
      <div className="grid gap-8">
        <ReportGenerator />
        <ReportHistory />
      </div>
    </DashboardShell>
  )
}

