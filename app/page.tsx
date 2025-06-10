"use client"

import type React from "react"

import { useState } from "react"
import { Search, TrendingUp, BarChart3, Newspaper, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    { symbol: "AAPL", name: "Apple Inc.", market: "US" },
    { symbol: "GOOGL", name: "Alphabet Inc.", market: "US" },
    { symbol: "MSFT", name: "Microsoft Corporation", market: "US" },
    { symbol: "TSLA", name: "Tesla, Inc.", market: "US" },
  ]

  const popularIndianStocks = [
    { symbol: "RELIANCE.NS", name: "Reliance Industries", market: "India" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", market: "India" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", market: "India" },
    { symbol: "INFY.NS", name: "Infosys Limited", market: "India" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank", market: "India" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", market: "India" },
    { symbol: "ITC.NS", name: "ITC Limited", market: "India" },
    { symbol: "MARUTI.NS", name: "Maruti Suzuki", market: "India" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Stock Predictor</h1>
          <p className="text-xl text-gray-600 mb-2">Predict stock prices using real-time data and sentiment analysis</p>
          <p className="text-lg text-blue-600 mb-8">Now featuring top 200+ Indian stocks from NSE/BSE</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              placeholder="Search stocks (e.g., Reliance, TCS, HDFC, Apple)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.slice(0, 9).map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-mono">{stock.displaySymbol}</span>
                        <div className="flex gap-1">
                          <Badge variant={stock.market === "India" ? "default" : "secondary"}>
                            {stock.market === "India" ? "NSE" : "US"}
                          </Badge>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{stock.description}</CardDescription>
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
            <p className="text-gray-600">
              No stocks found for "{searchQuery}". Try searching for popular stocks below.
            </p>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Real-time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Live stock prices and historical data for US and Indian markets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Indian Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Top 200+ Indian stocks from NSE and BSE exchanges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-blue-600" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Analyze market sentiment from news and social media to predict trends</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Advanced algorithms combine technical analysis with sentiment data</p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Stocks */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* US Stocks */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Badge variant="secondary">US Market</Badge>
              Popular US Stocks
            </h2>
            <div className="grid gap-4">
              {popularUSStocks.map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{stock.symbol}</span>
                        <Badge variant="outline">USD</Badge>
                      </CardTitle>
                      <CardDescription>{stock.name}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Indian Stocks */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Indian Market</Badge>
              Popular Indian Stocks
            </h2>
            <div className="grid gap-4">
              {popularIndianStocks.map((stock) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-mono">{stock.symbol.replace(".NS", "")}</span>
                        <Badge variant="outline">INR</Badge>
                      </CardTitle>
                      <CardDescription>{stock.name}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search Examples */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Reliance",
              "TCS",
              "HDFC",
              "Infosys",
              "Tata Motors",
              "Bajaj Finance",
              "Asian Paints",
              "Maruti",
              "SBI",
              "ITC",
            ].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term)
                  handleSearch()
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
