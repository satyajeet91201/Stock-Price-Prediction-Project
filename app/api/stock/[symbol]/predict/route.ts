import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

// Advanced ML-inspired prediction model
class StockPredictor {
  // Technical indicators calculation
  static calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 50 // Default neutral RSI

    let gains = 0
    let losses = 0

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1]
      if (change > 0) gains += change
      else losses += Math.abs(change)
    }

    const avgGain = gains / period
    const avgLoss = losses / period

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 }

    // Simple EMA calculation
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26

    // Signal line (9-period EMA of MACD)
    const macdHistory = [macd] // Simplified for demo
    const signal = macd * 0.9 // Simplified signal calculation
    const histogram = macd - signal

    return { macd, signal, histogram }
  }

  static calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0

    const multiplier = 2 / (period + 1)
    let ema = prices[0]

    for (let i = 1; i < Math.min(prices.length, period * 2); i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier)
    }

    return ema
  }

  static calculateBollingerBands(prices: number[], period = 20): { upper: number; middle: number; lower: number } {
    if (prices.length < period) return { upper: 0, middle: 0, lower: 0 }

    const recentPrices = prices.slice(-period)
    const sma = recentPrices.reduce((sum, price) => sum + price, 0) / period

    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    const stdDev = Math.sqrt(variance)

    return {
      upper: sma + stdDev * 2,
      middle: sma,
      lower: sma - stdDev * 2,
    }
  }

  // Sentiment scoring
  static calculateSentimentScore(newsData: any[]): number {
    if (!newsData || newsData.length === 0) return 0

    let totalScore = 0
    let weightedSum = 0

    newsData.forEach((article, index) => {
      // More recent news has higher weight
      const timeWeight = Math.exp(-index * 0.1)
      const sentimentValue = article.sentiment === "positive" ? 1 : article.sentiment === "negative" ? -1 : 0

      totalScore += sentimentValue * timeWeight * Math.abs(article.score || 0.5)
      weightedSum += timeWeight
    })

    return weightedSum > 0 ? totalScore / weightedSum : 0
  }

  // Volume analysis
  static calculateVolumeIndicator(historicalData: any[]): number {
    if (!historicalData || historicalData.length < 5) return 0

    const recentVolumes = historicalData.slice(-5).map((d) => d.v || 0)
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length
    const latestVolume = recentVolumes[recentVolumes.length - 1]

    // Volume momentum indicator
    return latestVolume > avgVolume * 1.2 ? 0.1 : latestVolume < avgVolume * 0.8 ? -0.1 : 0
  }

  // Main prediction algorithm
  static generatePredictions(
    historicalData: any[],
    sentimentScore: number,
    currentPrice: number,
    newsData: any[],
  ): any[] {
    const predictions = []

    if (!historicalData || historicalData.length < 5) {
      // Fallback predictions
      return this.generateFallbackPredictions(currentPrice, sentimentScore)
    }

    const prices = historicalData.map((d) => d.c || d.close || currentPrice)

    // Calculate technical indicators
    const rsi = this.calculateRSI(prices)
    const macd = this.calculateMACD(prices)
    const bollinger = this.calculateBollingerBands(prices)
    const volumeIndicator = this.calculateVolumeIndicator(historicalData)

    // Calculate trend
    const shortTermTrend = (prices[prices.length - 1] - prices[prices.length - 5]) / prices[prices.length - 5]
    const longTermTrend =
      prices.length >= 20
        ? (prices[prices.length - 1] - prices[prices.length - 20]) / prices[prices.length - 20]
        : shortTermTrend

    // Combine all factors for prediction
    for (let day = 1; day <= 7; day++) {
      // Technical analysis weight (40%)
      let technicalScore = 0

      // RSI influence
      if (rsi > 70)
        technicalScore -= 0.02 // Overbought
      else if (rsi < 30)
        technicalScore += 0.02 // Oversold
      else technicalScore += (50 - rsi) / 1000 // Neutral zone

      // MACD influence
      if (macd.histogram > 0) technicalScore += 0.01
      else technicalScore -= 0.01

      // Bollinger Bands influence
      const currentPosition = (currentPrice - bollinger.lower) / (bollinger.upper - bollinger.lower)
      if (currentPosition > 0.8)
        technicalScore -= 0.015 // Near upper band
      else if (currentPosition < 0.2) technicalScore += 0.015 // Near lower band

      // Sentiment analysis weight (30%)
      const sentimentWeight = sentimentScore * 0.02

      // Trend momentum weight (20%)
      const trendWeight = (shortTermTrend * 0.3 + longTermTrend * 0.1) * Math.exp(-day * 0.1)

      // Volume weight (10%)
      const volumeWeight = volumeIndicator

      // Combine all factors
      const totalChange = technicalScore * 0.4 + sentimentWeight * 0.3 + trendWeight * 0.2 + volumeWeight * 0.1

      // Add some randomness and time decay
      const randomFactor = (Math.random() - 0.5) * 0.01 // ±0.5% random
      const timeDecay = Math.exp(-day * 0.05) // Predictions become less certain over time

      const dailyChange = (totalChange + randomFactor) * timeDecay
      const predictedPrice = currentPrice * (1 + dailyChange * day * 0.3)

      // Calculate confidence based on data quality and consistency
      let confidence = 0.9
      confidence -= day * 0.08 // Decrease confidence over time
      confidence -= Math.abs(sentimentScore) > 0.5 ? 0.1 : 0 // High sentiment volatility
      confidence -= Math.abs(totalChange) > 0.05 ? 0.15 : 0 // High predicted volatility
      confidence = Math.max(0.2, Math.min(0.95, confidence))

      predictions.push({
        day: day,
        price: Math.max(predictedPrice, currentPrice * 0.7), // Don't predict drops > 30%
        confidence: confidence,
        factors: {
          technical: technicalScore * 0.4,
          sentiment: sentimentWeight * 0.3,
          trend: trendWeight * 0.2,
          volume: volumeWeight * 0.1,
          rsi: rsi,
          macd: macd.macd,
          sentimentScore: sentimentScore,
        },
      })
    }

    return predictions
  }

  static generateFallbackPredictions(currentPrice: number, sentimentScore: number): any[] {
    const predictions = []

    for (let day = 1; day <= 7; day++) {
      const randomChange = (Math.random() - 0.5) * 0.03 // ±1.5% random change
      const sentimentInfluence = sentimentScore * 0.01 // Sentiment influence
      const predictedPrice = currentPrice * (1 + (randomChange + sentimentInfluence) * day * 0.2)

      predictions.push({
        day: day,
        price: Math.max(predictedPrice, currentPrice * 0.8),
        confidence: Math.max(0.3, 0.7 - day * 0.05),
        factors: {
          technical: 0,
          sentiment: sentimentInfluence,
          trend: randomChange,
          volume: 0,
          rsi: 50,
          macd: 0,
          sentimentScore: sentimentScore,
        },
      })
    }

    return predictions
  }
}

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()

  try {
    // Fetch all required data in parallel
    const [stockResponse, historicalResponse, newsResponse] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/stock/${symbol}`),
      fetch(`${request.nextUrl.origin}/api/stock/${symbol}/historical`),
      fetch(`${request.nextUrl.origin}/api/stock/${symbol}/news`),
    ])

    let stockData = null
    let historicalData = []
    let newsData = []

    // Parse responses
    if (stockResponse.ok) {
      stockData = await stockResponse.json()
    }

    if (historicalResponse.ok) {
      historicalData = await historicalResponse.json()
    }

    if (newsResponse.ok) {
      newsData = await newsResponse.json()
    }

    // Calculate sentiment score from news
    const sentimentScore = StockPredictor.calculateSentimentScore(newsData)

    // Get current price
    const currentPrice = stockData?.price || 100

    // Generate ML-based predictions
    const predictions = StockPredictor.generatePredictions(historicalData, sentimentScore, currentPrice, newsData)

    console.log(`Generated ML predictions for ${symbol}:`, {
      currentPrice,
      sentimentScore,
      predictionsCount: predictions.length,
      avgConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
    })

    return NextResponse.json({
      predictions,
      metadata: {
        sentimentScore,
        currentPrice,
        dataQuality: {
          hasRealStock: stockData?.isRealData || false,
          hasRealHistorical: historicalData.some((d: any) => d.isRealData),
          hasRealNews: newsData.some((n: any) => n.isRealData),
          historicalPoints: historicalData.length,
          newsArticles: newsData.length,
        },
      },
    })
  } catch (error) {
    console.error("Prediction API error:", error)

    // Return basic predictions as fallback
    const fallbackPredictions = StockPredictor.generateFallbackPredictions(100, 0)
    return NextResponse.json({
      predictions: fallbackPredictions,
      metadata: {
        sentimentScore: 0,
        currentPrice: 100,
        dataQuality: {
          hasRealStock: false,
          hasRealHistorical: false,
          hasRealNews: false,
          historicalPoints: 0,
          newsArticles: 0,
        },
      },
    })
  }
}
