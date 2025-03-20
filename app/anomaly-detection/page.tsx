import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnomalyDetectionTool } from "@/components/anomaly-detection/anomaly-detection-tool"

export const metadata: Metadata = {
  title: "Anomaly Detection | Plexora",
  description: "Detect unusual patterns and outliers in your restaurant data",
}

export default function AnomalyDetectionPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Anomaly Detection"
        text="Identify unusual patterns and outliers in your restaurant data"
      />
      <div className="grid gap-4">
        <AnomalyDetectionTool />
      </div>
    </DashboardShell>
  )
}

