import type * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  config?: {
    value?: {
      label: string
      color: string
    }
  }
  className?: string
}

const ChartContainer = ({ children, config, className }: ChartContainerProps) => {
  const colorValue = config?.value?.color || "hsl(var(--primary))"
  return (
    <div className={cn("relative", className)} style={{ "--color-value": colorValue }}>
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  children?: React.ReactNode
}

const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return <div className="chart-tooltip">{children}</div>
}

type ChartTooltipContentProps = {}

const ChartTooltipContent = () => {
  return null
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }

