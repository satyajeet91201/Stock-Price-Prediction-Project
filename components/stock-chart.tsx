"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StockChartProps {
  data: any[]
}

export default function StockChart({ data }: StockChartProps) {
  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  }

  // Add data validation
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading historical data...</p>
          <p className="text-sm">This may take a moment</p>
        </div>
      </div>
    )
  }

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
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value.toFixed(0)}`} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
