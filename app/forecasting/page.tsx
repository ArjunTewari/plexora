import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ForecastingTool } from "@/components/forecasting/forecasting-tool"

export const metadata: Metadata = {
  title: "Forecasting | RestaurantIQ",
  description: "Predict future sales and optimize inventory with AI-powered forecasting",
}

export default function ForecastingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Forecasting & Analysis"
        text="Predict future sales and optimize inventory with AI-powered forecasting"
      />
      <div className="grid gap-4">
        <ForecastingTool />
      </div>
    </DashboardShell>
  )
}

