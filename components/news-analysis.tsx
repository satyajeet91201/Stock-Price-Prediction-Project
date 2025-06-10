"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface NewsItem {
  headline: string
  summary: string
  url: string
  datetime: number
  sentiment: "positive" | "negative" | "neutral"
  score: number
}

interface NewsAnalysisProps {
  news: NewsItem[]
  symbol: string
}

export default function NewsAnalysis({ news, symbol }: NewsAnalysisProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>
      default:
        return <Badge variant="outline">Neutral</Badge>
    }
  }

  // Add data validation
  if (!Array.isArray(news) || news.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Overview</CardTitle>
            <CardDescription>No recent news articles found for {symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No news data available</p>
              <p className="text-sm">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sentimentCounts = news.reduce(
    (acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalNews = news.length
  const positivePercent = (((sentimentCounts.positive || 0) / totalNews) * 100).toFixed(1)
  const negativePercent = (((sentimentCounts.negative || 0) / totalNews) * 100).toFixed(1)
  const neutralPercent = (((sentimentCounts.neutral || 0) / totalNews) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Overview</CardTitle>
          <CardDescription>
            Analysis of {totalNews} recent news articles about {symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{positivePercent}%</div>
              <div className="text-sm text-gray-600">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{neutralPercent}%</div>
              <div className="text-sm text-gray-600">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{negativePercent}%</div>
              <div className="text-sm text-gray-600">Negative</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent News</h3>
        {news.map((article, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-base leading-tight">{article.headline}</CardTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getSentimentIcon(article.sentiment)}
                  {getSentimentBadge(article.sentiment)}
                </div>
              </div>
              <CardDescription>
                {new Date(article.datetime * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Sentiment Score: {article.score.toFixed(2)}</div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  Read more <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
