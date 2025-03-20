import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataIntegrationTool } from "@/components/data-integration/data-integration-tool"

export const metadata: Metadata = {
  title: "Data Integration | RestaurantIQ",
  description: "Connect your POS system or upload data to RestaurantIQ",
}

export default function DataIntegrationPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Data Integration" text="Connect your POS system or upload data to RestaurantIQ" />
      <div className="grid gap-4">
        <DataIntegrationTool />
      </div>
    </DashboardShell>
  )
}

