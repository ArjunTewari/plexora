import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CustomerSegmentation } from "@/components/dashboard/customer-segmentation"
import { SalesSummary } from "@/components/dashboard/sales-summary"
import { TopSellingItems } from "@/components/dashboard/top-selling-items"
import { CompetitorInsights } from "@/components/dashboard/competitor-insights"
import { ForecastCard } from "@/components/dashboard/forecast-card"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesSummary />
        <RevenueChart />
        <CustomerSegmentation />
        <TopSellingItems />
        <CompetitorInsights />
        <ForecastCard />
      </div>
    </DashboardShell>
  )
} 