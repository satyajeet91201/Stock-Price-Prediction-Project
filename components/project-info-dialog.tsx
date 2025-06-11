"use client"

import { Info, Brain, TrendingUp, Newspaper, BarChart3, Zap, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Stock Predictor - Project Overview
          </DialogTitle>
          <DialogDescription>
            Advanced machine learning system for stock price prediction and market analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Machine Learning Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Technical Analysis</span>
                  <Badge variant="outline">40%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sentiment Analysis</span>
                  <Badge variant="outline">30%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trend Analysis</span>
                  <Badge variant="outline">20%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Volume Analysis</span>
                  <Badge variant="outline">10%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                  Market Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">US Stocks (NASDAQ, NYSE)</span>
                  <Badge className="bg-blue-100 text-blue-800">Live API</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Indian Stocks (NSE, BSE)</span>
                  <Badge className="bg-orange-100 text-orange-800">200+ Stocks</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Real-time Data</span>
                  <Badge className="bg-green-100 text-green-800">Finnhub API</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Technical Analysis Components
              </CardTitle>
              <CardDescription>Advanced financial indicators used in our ML model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">RSI (Relative Strength Index)</h4>
                    <p className="text-xs text-muted-foreground">
                      Measures overbought/oversold conditions (0-100 scale)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">MACD (Moving Average Convergence Divergence)</h4>
                    <p className="text-xs text-muted-foreground">Identifies trend changes and momentum shifts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Bollinger Bands</h4>
                    <p className="text-xs text-muted-foreground">
                      Statistical bands indicating price volatility and support/resistance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Volume Analysis</h4>
                    <p className="text-xs text-muted-foreground">Trading volume patterns and momentum indicators</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-green-600" />
                Sentiment Analysis Engine
              </CardTitle>
              <CardDescription>Natural Language Processing for market sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Positive Indicators</h4>
                    <div className="flex flex-wrap gap-1">
                      {["buy", "bullish", "growth", "profit", "surge", "breakthrough", "strong"].map((word) => (
                        <Badge key={word} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Negative Indicators</h4>
                    <div className="flex flex-wrap gap-1">
                      {["sell", "bearish", "decline", "loss", "crash", "concern", "weak"].map((word) => (
                        <Badge key={word} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our NLP engine analyzes news headlines and summaries, weighing recent articles more heavily and
                  calculating sentiment scores that influence price predictions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Algorithm */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Prediction Algorithm
              </CardTitle>
              <CardDescription>How our AI generates 7-day price forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Data Collection</h4>
                    <p className="text-xs text-muted-foreground">
                      Fetch real-time prices, historical data, and recent news articles
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Technical Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Calculate RSI, MACD, Bollinger Bands, and volume indicators
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Sentiment Scoring</h4>
                    <p className="text-xs text-muted-foreground">
                      Analyze news sentiment with time-weighted importance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">ML Prediction</h4>
                    <p className="text-xs text-muted-foreground">
                      Combine all factors with confidence scoring and time decay
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge className="mb-2">Frontend</Badge>
                  <p className="text-xs">Next.js 15, React, TypeScript</p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2">Styling</Badge>
                  <p className="text-xs">Tailwind CSS, shadcn/ui</p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2">Charts</Badge>
                  <p className="text-xs">Recharts, Interactive Visualizations</p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2">API</Badge>
                  <p className="text-xs">Finnhub Financial Data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Shield className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is an educational project demonstrating AI and machine learning concepts. Predictions are for
                demonstration purposes only and should not be used for actual investment decisions. Always consult with
                financial professionals before making investment choices.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
