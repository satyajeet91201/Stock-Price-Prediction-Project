"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictionChartProps {
  historical: any[]
  predictions: any[]
  metadata?: any
}

export default function PredictionChart({ historical, predictions, metadata }: PredictionChartProps) {
  const chartConfig = {
    historical: {
      label: "Historical Price",
      color: "hsl(var(--chart-1))",
    },
    predicted: {
      label: "AI Predicted Price",
      color: "hsl(var(--chart-2))",
    },
  }

  // Add data validation
  if (!Array.isArray(historical) || !Array.isArray(predictions)) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Unable to generate predictions</p>
          <p className="text-sm">Insufficient data available</p>
        </div>
      </div>
    )
  }

  if (historical.length === 0 && predictions.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No data available for predictions</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  // Combine historical and prediction data
  const combinedData = [
    ...historical.slice(-10).map((item) => ({
      date: new Date(item.t * 1000).toLocaleDateString(),
      historical: item.c,
      predicted: null,
      timestamp: item.t,
      confidence: null,
    })),
    ...predictions.map((item, index) => ({
      date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      historical: null,
      predicted: item.price,
      timestamp: Date.now() + (index + 1) * 24 * 60 * 60 * 1000,
      confidence: item.confidence,
    })),
  ]

  // Calculate average confidence
  const avgConfidence =
    predictions.length > 0 ? predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictions.length : 0

  return (
    <div className="space-y-6">
      {/* ML Model Information */}
      {metadata && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sentiment Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {metadata.sentimentScore > 0 ? "+" : ""}
                {(metadata.sentimentScore * 100).toFixed(1)}%
              </div>
              <Badge
                variant={
                  metadata.sentimentScore > 0.1
                    ? "default"
                    : metadata.sentimentScore < -0.1
                      ? "destructive"
                      : "secondary"
                }
              >
                {metadata.sentimentScore > 0.1 ? "Bullish" : metadata.sentimentScore < -0.1 ? "Bearish" : "Neutral"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Model Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{(avgConfidence * 100).toFixed(1)}%</div>
              <Badge variant={avgConfidence > 0.7 ? "default" : avgConfidence > 0.5 ? "secondary" : "outline"}>
                {avgConfidence > 0.7 ? "High" : avgConfidence > 0.5 ? "Medium" : "Low"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Data Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{metadata.dataQuality?.hasRealStock ? "Real" : "Simulated"}</div>
              <Badge variant={metadata.dataQuality?.hasRealStock ? "default" : "secondary"}>
                {metadata.dataQuality?.hasRealStock ? "Live API" : "Demo Mode"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">News Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{metadata.dataQuality?.newsArticles || 0}</div>
              <Badge variant="outline">Analyzed</Badge>
            </CardContent>
          </Card>
          {metadata && metadata.dataQuality && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ML Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">3 Models</div>
                <Badge variant="default">Linear + Neural + ARIMA</Badge>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Chart Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Historical Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>AI Predicted Price</span>
        </div>
      </div>

      {/* Main Chart */}
      <ChartContainer config={chartConfig} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
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
              formatter={(value: any, name: string) => {
                if (name === "predicted" && combinedData.find((d) => d.predicted === value)?.confidence) {
                  const confidence = combinedData.find((d) => d.predicted === value)?.confidence
                  return [`$${value.toFixed(2)} (${(confidence * 100).toFixed(0)}% confidence)`, "AI Prediction"]
                }
                return [`$${value.toFixed(2)}`, name === "historical" ? "Historical" : "Predicted"]
              }}
            />
            <ReferenceLine x={new Date().toLocaleDateString()} stroke="#666" strokeDasharray="2 2" label="Today" />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="var(--color-historical)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--color-predicted)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "var(--color-predicted)", strokeWidth: 2, r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Prediction Details */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">7-Day Price Predictions</CardTitle>
            <CardDescription>
              AI-powered predictions based on technical analysis, sentiment, and market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {predictions.slice(0, 7).map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">Day {prediction.day}</div>
                    <div className="text-lg font-bold">${prediction.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{(prediction.confidence * 100).toFixed(0)}% confidence</Badge>
                    {prediction.factors && (
                      <div className="text-xs text-gray-500">RSI: {prediction.factors.rsi?.toFixed(1) || "N/A"}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Our ML Models Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-600">Linear Regression</div>
              <div className="text-xs text-gray-600 mt-1">Trend Analysis</div>
              <div className="text-xs">
                R² Score:{" "}
                {predictions[0]?.mlModels?.linearRegression?.r2
                  ? (predictions[0].mlModels.linearRegression.r2 * 100).toFixed(1) + "%"
                  : "N/A"}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-600">Neural Network</div>
              <div className="text-xs text-gray-600 mt-1">Pattern Recognition</div>
              <div className="text-xs">
                Accuracy:{" "}
                {predictions[0]?.mlModels?.neuralNetwork?.accuracy
                  ? (predictions[0].mlModels.neuralNetwork.accuracy * 100).toFixed(1) + "%"
                  : "N/A"}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-600">ARIMA Model</div>
              <div className="text-xs text-gray-600 mt-1">Time Series</div>
              <div className="text-xs">
                Accuracy:{" "}
                {predictions[0]?.mlModels?.arima?.accuracy
                  ? (predictions[0].mlModels.arima.accuracy * 100).toFixed(1) + "%"
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
            <div className="text-center">
              <div className="font-semibold text-blue-600">50%</div>
              <div>ML Models</div>
              <div className="text-xs text-gray-500">Linear + Neural + ARIMA</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">20%</div>
              <div>Technical Analysis</div>
              <div className="text-xs text-gray-500">RSI, MACD, Bollinger</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">15%</div>
              <div>Sentiment Analysis</div>
              <div className="text-xs text-gray-500">News & Social Media</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">15%</div>
              <div>Market Factors</div>
              <div className="text-xs text-gray-500">Volume & Trends</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-2">🤖 Machine Learning Components:</h4>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Linear Regression:</strong> Identifies price trends and momentum
              </li>
              <li>
                <strong>Neural Network:</strong> Learns complex patterns from historical data
              </li>
              <li>
                <strong>ARIMA Model:</strong> Time series forecasting with autoregression
              </li>
              <li>
                <strong>Ensemble Method:</strong> Combines all models for robust predictions
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Our ML system trains on historical data in real-time, combining multiple algorithms for accurate
            predictions. Model confidence decreases over time as market uncertainty increases.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
