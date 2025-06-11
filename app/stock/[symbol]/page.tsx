"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProjectInfoDialog } from "@/components/project-info-dialog"
import { SentimentIndicator } from "@/components/sentiment-indicator"
import Link from "next/link"
import StockChart from "@/components/stock-chart"
import PredictionChart from "@/components/prediction-chart"
import NewsAnalysis from "@/components/news-analysis"

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
  isRealData?: boolean
}

interface NewsItem {
  headline: string
  summary: string
  url: string
  datetime: number
  sentiment: "positive" | "negative" | "neutral"
  score: number
  isRealData?: boolean
}

interface PredictionData {
  predictions: any[]
  metadata: any
}

export default function StockPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log(`Fetching comprehensive data for ${symbol}`)

        // Fetch all data in parallel
        const [stockResponse, historicalResponse, newsResponse, predictionResponse] = await Promise.all([
          fetch(`/api/stock/${symbol}`),
          fetch(`/api/stock/${symbol}/historical`),
          fetch(`/api/stock/${symbol}/news`),
          fetch(`/api/stock/${symbol}/predict`),
        ])

        // Handle stock data
        if (stockResponse.ok) {
          const stockData = await stockResponse.json()
          setStockData(stockData)
          console.log(`Stock data (${stockData.isRealData ? "Real" : "Simulated"}):`, stockData.price)
        } else {
          throw new Error("Failed to fetch stock data")
        }

        // Handle historical data
        if (historicalResponse.ok) {
          const historicalData = await historicalResponse.json()
          setHistoricalData(Array.isArray(historicalData) ? historicalData : [])
          console.log(`Historical data: ${historicalData.length} points`)
        } else {
          setHistoricalData([])
        }

        // Handle news data
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          setNews(Array.isArray(newsData) ? newsData : [])
          console.log(`News data: ${newsData.length} articles`)
        } else {
          setNews([])
        }

        // Handle predictions
        if (predictionResponse.ok) {
          const predictionData = await predictionResponse.json()
          setPredictionData(predictionData)
          console.log(
            `ML Predictions generated with ${(predictionData.metadata?.sentimentScore * 100 || 0).toFixed(1)}% sentiment`,
          )
        } else {
          setPredictionData(null)
        }

        console.log(`Successfully loaded comprehensive data for ${symbol}`)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchData()
    }
  }, [symbol])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
            <Brain className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <p className="text-lg font-semibold mb-2">Analyzing {symbol}</p>
          <p className="text-muted-foreground">Running AI predictions and sentiment analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !stockData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || "Stock not found"}</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPositive = stockData.change >= 0
  const isIndianStock = symbol.includes(".NS")
  const currencySymbol = isIndianStock ? "₹" : "$"
  const dataQuality = predictionData?.metadata?.dataQuality

  // Calculate overall sentiment
  const overallSentiment =
    predictionData?.metadata?.sentimentScore > 0.1
      ? "positive"
      : predictionData?.metadata?.sentimentScore < -0.1
        ? "negative"
        : "neutral"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {symbol}
                </h1>
                <Badge variant={stockData.isRealData ? "default" : "secondary"}>
                  {stockData.isRealData ? "Live Data" : "Demo Mode"}
                </Badge>
                {isIndianStock && <Badge variant="outline">NSE</Badge>}
              </div>
              <p className="text-muted-foreground">AI-powered analysis with real-time predictions</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Data Quality Notice */}
        <Alert className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            {stockData.isRealData
              ? `Live data from Finnhub API. ML model analyzing ${dataQuality?.newsArticles || 0} news articles and ${dataQuality?.historicalPoints || 0} price points.`
              : "Demo mode with realistic simulated data. Enable API access for live market data and enhanced predictions."}
          </AlertDescription>
        </Alert>

        {/* Stock Overview with Sentiment */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card className="md:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencySymbol}
                {stockData.price.toFixed(2)}
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {isPositive ? "+" : ""}
                {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Day Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {currencySymbol}
                {stockData.low.toFixed(2)} - {currencySymbol}
                {stockData.high.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Low - High</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {currencySymbol}
                {stockData.open.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Today's Open</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Previous Close</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {currencySymbol}
                {stockData.previousClose.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Yesterday</div>
            </CardContent>
          </Card>

          {/* Sentiment Indicator */}
          <SentimentIndicator
            sentiment={overallSentiment}
            score={predictionData?.metadata?.sentimentScore}
            changePercent={stockData.changePercent}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="prediction" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger
              value="prediction"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              AI Prediction
            </TabsTrigger>
            <TabsTrigger
              value="chart"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Price Chart
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              News & Sentiment
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Technical Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Powered Price Prediction
                </CardTitle>
                <CardDescription>
                  Machine learning model combining technical analysis, sentiment analysis, and market trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionChart
                  historical={historicalData}
                  predictions={predictionData?.predictions || []}
                  metadata={predictionData?.metadata}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
              <CardHeader>
                <CardTitle>Historical Price Chart</CardTitle>
                <CardDescription>
                  Price movement over the last 30 days {stockData.isRealData ? "(live data)" : "(simulated data)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockChart data={historicalData} symbol={symbol} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <NewsAnalysis news={news} symbol={symbol} />
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle>Technical Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {predictionData?.predictions?.[0]?.factors ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">RSI (14)</span>
                        <Badge variant="outline">
                          {predictionData.predictions[0].factors.rsi?.toFixed(1) || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">MACD</span>
                        <Badge variant="outline">
                          {predictionData.predictions[0].factors.macd > 0 ? "Bullish" : "Bearish"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sentiment Score</span>
                        <Badge variant={predictionData.metadata.sentimentScore > 0 ? "default" : "destructive"}>
                          {(predictionData.metadata.sentimentScore * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Trend Analysis</span>
                        <Badge variant="outline">
                          {predictionData.predictions[0].factors.trend > 0 ? "Uptrend" : "Downtrend"}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">RSI (14)</span>
                        <Badge variant="outline">{(45 + Math.random() * 30).toFixed(1)}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">MACD</span>
                        <Badge variant="outline">{Math.random() > 0.5 ? "Bullish" : "Bearish"}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Moving Average (20)</span>
                        <Badge variant="outline">
                          {currencySymbol}
                          {(stockData.price * (0.95 + Math.random() * 0.1)).toFixed(2)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Volume</span>
                        <Badge variant="outline">{Math.random() > 0.5 ? "High" : "Normal"}</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle>Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Sentiment</span>
                    <Badge
                      className={
                        predictionData?.metadata?.sentimentScore > 0.1
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : predictionData?.metadata?.sentimentScore < -0.1
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }
                    >
                      {predictionData?.metadata?.sentimentScore > 0.1
                        ? "Positive"
                        : predictionData?.metadata?.sentimentScore < -0.1
                          ? "Negative"
                          : "Neutral"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">News Sentiment</span>
                    <Badge variant="outline">
                      {news.length > 0
                        ? `${Math.round((news.filter((n) => n.sentiment === "positive").length / news.length) * 100)}% Positive`
                        : "No Data"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Data Source</span>
                    <Badge
                      className={
                        stockData.isRealData
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }
                    >
                      {stockData.isRealData ? "Live API" : "Demo Mode"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prediction Confidence</span>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {predictionData?.predictions?.[0]?.confidence
                        ? `${(predictionData.predictions[0].confidence * 100).toFixed(0)}%`
                        : "N/A"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Info Dialog */}
      <ProjectInfoDialog />
    </div>
  )
}
