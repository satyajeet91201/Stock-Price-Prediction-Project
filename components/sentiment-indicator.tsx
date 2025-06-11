"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SentimentIndicatorProps {
  sentiment: "positive" | "negative" | "neutral"
  score?: number
  changePercent?: number
  className?: string
}

export function SentimentIndicator({ sentiment, score, changePercent, className }: SentimentIndicatorProps) {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 dark:text-green-400"
      case "negative":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4" />
      case "negative":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getSentimentBadge = () => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Bullish</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Bearish</Badge>
      default:
        return (
          <Badge variant="outline" className="dark:border-gray-600">
            Neutral
          </Badge>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${getSentimentColor()}`}>
            {getSentimentIcon()}
            <span className="font-semibold capitalize">{sentiment}</span>
          </div>
          {getSentimentBadge()}
        </div>
        {score !== undefined && (
          <div className="mt-2 text-xs text-muted-foreground">Sentiment Score: {(score * 100).toFixed(1)}%</div>
        )}
        {changePercent !== undefined && (
          <div
            className={`mt-1 text-xs ${changePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            Price Change: {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}
