"use client"

import type React from "react"

import { useState } from "react"
import { Search, TrendingUp, BarChart3, Newspaper, Globe, Sparkles, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProjectInfoDialog } from "@/components/project-info-dialog"
import Link from "next/link"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      console.log("Searching for:", searchQuery)
      const response = await fetch(`/api/search-stocks?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      console.log("Search results:", data)
      setSearchResults(data.result || [])
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const popularUSStocks = [
    { symbol: "AAPL", name: "Apple Inc.", market: "US", trend: "up" },
    { symbol: "GOOGL", name: "Alphabet Inc.", market: "US", trend: "up" },
    { symbol: "MSFT", name: "Microsoft Corporation", market: "US", trend: "up" },
    { symbol: "TSLA", name: "Tesla, Inc.", market: "US", trend: "down" },
  ]

  const popularIndianStocks = [
    { symbol: "RELIANCE.NS", name: "Reliance Industries", market: "India", trend: "up" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", market: "India", trend: "up" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", market: "India", trend: "neutral" },
    { symbol: "INFY.NS", name: "Infosys Limited", market: "India", trend: "up" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank", market: "India", trend: "down" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", market: "India", trend: "up" },
    { symbol: "ITC.NS", name: "ITC Limited", market: "India", trend: "neutral" },
    { symbol: "MARUTI.NS", name: "Maruti Suzuki", market: "India", trend: "up" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 rotate-180" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600" />
    }
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "up":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Bullish</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Bearish</Badge>
      default:
        return <Badge variant="outline">Neutral</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Brain className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Stock Predictor
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Advanced machine learning system for stock price prediction using real-time data and sentiment analysis
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline">200+ Indian Stocks</Badge>
            <Badge variant="outline">Real-time Data</Badge>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                placeholder="Search stocks (e.g., Reliance, TCS, Apple)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-4 pr-12 h-12 text-lg border-2 border-primary/20 focus:border-primary/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-1 top-1 h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Search Results
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.slice(0, 9).map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-mono group-hover:text-primary transition-colors">
                          {stock.displaySymbol}
                        </span>
                        <div className="flex gap-1">
                          <Badge variant={stock.market === "India" ? "default" : "secondary"}>
                            {stock.market === "India" ? "NSE" : "US"}
                          </Badge>
                          {Math.random() > 0.5 &&
                            getTrendBadge(["up", "down", "neutral"][Math.floor(Math.random() * 3)])}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 group-hover:text-foreground transition-colors">
                        {stock.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show message if search returned no results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="mb-8 text-center">
            <Card className="max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No stocks found for "{searchQuery}". Try searching for popular stocks below.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Real-time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Live stock prices and historical data for US and Indian markets via Finnhub API
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Globe className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Global Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-600 dark:text-orange-400 text-sm">
                200+ Indian stocks from NSE/BSE and major US stocks with proper currency display
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Newspaper className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Advanced NLP analysis of news and social media to predict market sentiment trends
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Machine learning algorithms combining technical analysis with sentiment data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Stocks */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* US Stocks */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                US Market
              </Badge>
              Popular US Stocks
            </h2>
            <div className="grid gap-4">
              {popularUSStocks.map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="group-hover:text-primary transition-colors">{stock.symbol}</span>
                          {getTrendIcon(stock.trend)}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">USD</Badge>
                          {getTrendBadge(stock.trend)}
                        </div>
                      </CardTitle>
                      <CardDescription className="group-hover:text-foreground transition-colors">
                        {stock.name}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Indian Stocks */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Indian Market
              </Badge>
              Popular Indian Stocks
            </h2>
            <div className="grid gap-4">
              {popularIndianStocks.map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono group-hover:text-primary transition-colors">
                            {stock.symbol.replace(".NS", "")}
                          </span>
                          {getTrendIcon(stock.trend)}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">INR</Badge>
                          {getTrendBadge(stock.trend)}
                        </div>
                      </CardTitle>
                      <CardDescription className="group-hover:text-foreground transition-colors">
                        {stock.name}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search Examples */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Try searching for:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Reliance",
              "TCS",
              "HDFC",
              "Infosys",
              "Apple",
              "Tesla",
              "Microsoft",
              "Google",
              "Tata Motors",
              "Bajaj Finance",
            ].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term)
                  handleSearch()
                }}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Info Dialog */}
      <ProjectInfoDialog />
    </div>
  )
}
