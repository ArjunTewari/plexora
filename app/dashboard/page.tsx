import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SalesSummary } from "@/components/dashboard/sales-summary"
import { TopSellingItems } from "@/components/dashboard/top-selling-items"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CustomerSegmentation } from "@/components/dashboard/customer-segmentation"
import { ForecastCard } from "@/components/dashboard/forecast-card"
import { CompetitorInsights } from "@/components/dashboard/competitor-insights"
import { LiveSalesCounter } from "@/components/real-time/live-sales-counter"

export const metadata: Metadata = {
  title: "Dashboard | Plexora",
  description: "Real-time analytics dashboard for your restaurant",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Real-time analytics and insights for your restaurant" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesSummary />
        <ForecastCard />
        <LiveSalesCounter />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopSellingItems />
        <div className="md:col-span-2">
          <RevenueChart />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CustomerSegmentation />
        <CompetitorInsights />
      </div>
    </DashboardShell>
  )
}

