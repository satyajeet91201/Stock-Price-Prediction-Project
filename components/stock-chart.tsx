"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StockChartProps {
  data: any[]
  symbol?: string
}

export default function StockChart({ data, symbol }: StockChartProps) {
  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  }

  // Add data validation
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading historical data...</p>
          <p className="text-sm">This may take a moment</p>
        </div>
      </div>
    )
  }

  const isIndianStock = symbol?.includes(".NS")
  const currencySymbol = isIndianStock ? "₹" : "$"

  const formattedData = data.map((item) => ({
    date: new Date(item.t * 1000).toLocaleDateString(),
    price: item.c,
    timestamp: item.t,
  }))

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }}
            className="text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
            className="text-muted-foreground"
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value: any) => [`${currencySymbol}${value.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            strokeWidth={2}
            dot={false}
            className="drop-shadow-sm"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
