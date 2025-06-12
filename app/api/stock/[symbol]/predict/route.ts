import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

// Enhanced ML-powered prediction model with actual machine learning
class StockPredictor {
  // Simple Linear Regression ML Model
  static trainLinearRegression(prices: number[]): { slope: number; intercept: number; r2: number } {
    const n = prices.length
    if (n < 2) return { slope: 0, intercept: prices[0] || 0, r2: 0 }

    const x = Array.from({ length: n }, (_, i) => i)
    const y = prices

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

    const meanX = sumX / n
    const meanY = sumY / n

    const slope = (sumXY - n * meanX * meanY) / (sumXX - n * meanX * meanX)
    const intercept = meanY - slope * meanX

    // Calculate R-squared
    const totalSumSquares = sumYY - n * meanY * meanY
    const residualSumSquares = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept
      return sum + Math.pow(yi - predicted, 2)
    }, 0)

    const r2 = totalSumSquares > 0 ? 1 - residualSumSquares / totalSumSquares : 0

    return { slope, intercept, r2: Math.max(0, Math.min(1, r2)) }
  }

  // Simple Neural Network for Price Prediction
  static trainSimpleNeuralNetwork(prices: number[], features: number[][]): any {
    if (prices.length < 5 || features.length < 5) {
      return { weights: [0.1, 0.1, 0.1], bias: 0, accuracy: 0 }
    }

    // Initialize weights and bias
    const weights = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]
    let bias = Math.random() - 0.5
    const learningRate = 0.01
    const epochs = 100

    // Simple gradient descent training
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0

      for (let i = 0; i < Math.min(prices.length - 1, features.length); i++) {
        // Forward pass
        const input = features[i] || [prices[i] || 0, prices[i - 1] || 0, prices[i - 2] || 0]
        const prediction = input.reduce((sum, val, idx) => sum + val * weights[idx], bias)
        const target = prices[i + 1]
        const error = target - prediction
        totalError += error * error

        // Backward pass (gradient descent)
        for (let j = 0; j < weights.length; j++) {
          weights[j] += learningRate * error * (input[j] || 0)
        }
        bias += learningRate * error
      }

      // Early stopping if error is small enough
      if (totalError < 0.01) break
    }

    // Calculate accuracy
    let correctPredictions = 0
    for (let i = 0; i < Math.min(prices.length - 1, features.length); i++) {
      const input = features[i] || [prices[i] || 0, prices[i - 1] || 0, prices[i - 2] || 0]
      const prediction = input.reduce((sum, val, idx) => sum + val * weights[idx], bias)
      const target = prices[i + 1]
      const accuracy = 1 - Math.abs(prediction - target) / target
      if (accuracy > 0.95) correctPredictions++
    }

    const accuracy = correctPredictions / Math.min(prices.length - 1, features.length)

    return { weights, bias, accuracy: Math.max(0, Math.min(1, accuracy)) }
  }

  // ARIMA-like Time Series Model
  static trainARIMAModel(prices: number[]): { coefficients: number[]; accuracy: number } {
    if (prices.length < 10) {
      return { coefficients: [0.5, 0.3, 0.2], accuracy: 0 }
    }

    // Simple autoregressive model AR(3)
    const order = 3
    const n = prices.length

    // Prepare training data
    const X: number[][] = []
    const y: number[] = []

    for (let i = order; i < n; i++) {
      X.push([prices[i - 1], prices[i - 2], prices[i - 3]])
      y.push(prices[i])
    }

    // Simple least squares estimation
    const coefficients = this.leastSquares(X, y)

    // Calculate model accuracy
    let totalError = 0
    let validPredictions = 0

    for (let i = 0; i < X.length; i++) {
      const predicted = X[i].reduce((sum, val, idx) => sum + val * coefficients[idx], 0)
      const actual = y[i]
      if (actual !== 0) {
        totalError += Math.abs((predicted - actual) / actual)
        validPredictions++
      }
    }

    const accuracy = validPredictions > 0 ? Math.max(0, 1 - totalError / validPredictions) : 0

    return { coefficients, accuracy }
  }

  // Least squares helper method
  static leastSquares(X: number[][], y: number[]): number[] {
    const n = X.length
    const m = X[0]?.length || 0

    if (n === 0 || m === 0) return [0.5, 0.3, 0.2]

    // Initialize coefficients
    const coefficients = Array(m).fill(0)

    // Simple iterative solution
    const learningRate = 0.001
    const iterations = 1000

    for (let iter = 0; iter < iterations; iter++) {
      const gradients = Array(m).fill(0)

      for (let i = 0; i < n; i++) {
        const predicted = X[i].reduce((sum, val, idx) => sum + val * coefficients[idx], 0)
        const error = predicted - y[i]

        for (let j = 0; j < m; j++) {
          gradients[j] += error * X[i][j]
        }
      }

      // Update coefficients
      for (let j = 0; j < m; j++) {
        coefficients[j] -= (learningRate * gradients[j]) / n
      }
    }

    return coefficients
  }

  // Enhanced prediction with ML models
  static generateMLPredictions(
    historicalData: any[],
    sentimentScore: number,
    currentPrice: number,
    newsData: any[],
  ): any[] {
    const predictions = []

    if (!historicalData || historicalData.length < 5) {
      return this.generateFallbackPredictions(currentPrice, sentimentScore)
    }

    const prices = historicalData.map((d) => d.c || d.close || currentPrice)

    // Train ML models
    console.log("Training ML models...")

    // 1. Linear Regression Model
    const linearModel = this.trainLinearRegression(prices)
    console.log(`Linear Regression R²: ${(linearModel.r2 * 100).toFixed(1)}%`)

    // 2. Prepare features for Neural Network
    const features = []
    for (let i = 2; i < prices.length; i++) {
      features.push([
        prices[i - 1],
        prices[i - 2],
        (prices[i - 1] - prices[i - 2]) / prices[i - 2], // price change ratio
      ])
    }

    const neuralModel = this.trainSimpleNeuralNetwork(prices.slice(2), features)
    console.log(`Neural Network Accuracy: ${(neuralModel.accuracy * 100).toFixed(1)}%`)

    // 3. ARIMA Model
    const arimaModel = this.trainARIMAModel(prices)
    console.log(`ARIMA Model Accuracy: ${(arimaModel.accuracy * 100).toFixed(1)}%`)

    // Calculate traditional indicators
    const rsi = this.calculateRSI(prices)
    const macd = this.calculateMACD(prices)
    const bollinger = this.calculateBollingerBands(prices)
    const volumeIndicator = this.calculateVolumeIndicator(historicalData)

    // Generate predictions for next 7 days
    for (let day = 1; day <= 7; day++) {
      // ML Model Predictions

      // Linear Regression Prediction
      const linearPrediction = linearModel.slope * (prices.length + day - 1) + linearModel.intercept

      // Neural Network Prediction
      const lastFeatures = [
        prices[prices.length - 1],
        prices[prices.length - 2] || prices[prices.length - 1],
        (prices[prices.length - 1] - (prices[prices.length - 2] || prices[prices.length - 1])) /
          (prices[prices.length - 2] || prices[prices.length - 1]),
      ]
      const neuralPrediction = lastFeatures.reduce(
        (sum, val, idx) => sum + val * neuralModel.weights[idx],
        neuralModel.bias,
      )

      // ARIMA Prediction
      const arimaPrediction = arimaModel.coefficients.reduce(
        (sum, coef, idx) => sum + coef * (prices[prices.length - 1 - idx] || prices[prices.length - 1]),
        0,
      )

      // Traditional Technical Analysis
      let technicalScore = 0
      if (rsi > 70) technicalScore -= 0.02
      else if (rsi < 30) technicalScore += 0.02
      else technicalScore += (50 - rsi) / 1000

      if (macd.histogram > 0) technicalScore += 0.01
      else technicalScore -= 0.01

      // Sentiment and trend factors
      const sentimentWeight = sentimentScore * 0.02
      const shortTermTrend = (prices[prices.length - 1] - prices[prices.length - 5]) / prices[prices.length - 5]
      const trendWeight = shortTermTrend * 0.1 * Math.exp(-day * 0.1)

      // Ensemble ML Prediction (weighted combination)
      const mlWeight = 0.5 // 50% ML models, 50% traditional
      const traditionalWeight = 0.5

      const mlPrediction =
        linearPrediction * 0.4 + // Linear regression weight
        neuralPrediction * 0.4 + // Neural network weight
        arimaPrediction * 0.2 // ARIMA weight

      const traditionalPrediction = currentPrice * (1 + technicalScore + sentimentWeight + trendWeight)

      const finalPrediction = mlPrediction * mlWeight + traditionalPrediction * traditionalWeight

      // Calculate ensemble confidence
      const modelAgreement = 1 - Math.abs(mlPrediction - traditionalPrediction) / currentPrice
      const baseConfidence = linearModel.r2 * 0.4 + neuralModel.accuracy * 0.4 + arimaModel.accuracy * 0.2
      const timeDecay = Math.exp(-day * 0.1)
      const confidence = Math.max(0.2, Math.min(0.95, baseConfidence * modelAgreement * timeDecay))

      predictions.push({
        day: day,
        price: Math.max(finalPrediction, currentPrice * 0.7), // Prevent extreme drops
        confidence: confidence,
        mlModels: {
          linearRegression: {
            prediction: linearPrediction,
            r2: linearModel.r2,
            slope: linearModel.slope,
          },
          neuralNetwork: {
            prediction: neuralPrediction,
            accuracy: neuralModel.accuracy,
            weights: neuralModel.weights,
          },
          arima: {
            prediction: arimaPrediction,
            accuracy: arimaModel.accuracy,
            coefficients: arimaModel.coefficients,
          },
        },
        factors: {
          technical: technicalScore * traditionalWeight,
          sentiment: sentimentWeight * traditionalWeight,
          trend: trendWeight * traditionalWeight,
          ml: mlPrediction * mlWeight,
          volume: volumeIndicator,
          rsi: rsi,
          macd: macd.macd,
          sentimentScore: sentimentScore,
        },
      })
    }

    return predictions
  }

  // Keep existing technical indicator methods
  static calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 50

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

    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26
    const signal = macd * 0.9
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

  static calculateSentimentScore(newsData: any[]): number {
    if (!newsData || newsData.length === 0) return 0

    let totalScore = 0
    let weightedSum = 0

    newsData.forEach((article, index) => {
      const timeWeight = Math.exp(-index * 0.1)
      const sentimentValue = article.sentiment === "positive" ? 1 : article.sentiment === "negative" ? -1 : 0
      totalScore += sentimentValue * timeWeight * Math.abs(article.score || 0.5)
      weightedSum += timeWeight
    })

    return weightedSum > 0 ? totalScore / weightedSum : 0
  }

  static calculateVolumeIndicator(historicalData: any[]): number {
    if (!historicalData || historicalData.length < 5) return 0

    const recentVolumes = historicalData.slice(-5).map((d) => d.v || 0)
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length
    const latestVolume = recentVolumes[recentVolumes.length - 1]

    return latestVolume > avgVolume * 1.2 ? 0.1 : latestVolume < avgVolume * 0.8 ? -0.1 : 0
  }

  static generateFallbackPredictions(currentPrice: number, sentimentScore: number): any[] {
    const predictions = []

    for (let day = 1; day <= 7; day++) {
      const randomChange = (Math.random() - 0.5) * 0.03
      const sentimentInfluence = sentimentScore * 0.01
      const predictedPrice = currentPrice * (1 + (randomChange + sentimentInfluence) * day * 0.2)

      predictions.push({
        day: day,
        price: Math.max(predictedPrice, currentPrice * 0.8),
        confidence: Math.max(0.3, 0.7 - day * 0.05),
        mlModels: {
          linearRegression: { prediction: predictedPrice, r2: 0, slope: 0 },
          neuralNetwork: { prediction: predictedPrice, accuracy: 0, weights: [0, 0, 0] },
          arima: { prediction: predictedPrice, accuracy: 0, coefficients: [0, 0, 0] },
        },
        factors: {
          technical: 0,
          sentiment: sentimentInfluence,
          trend: randomChange,
          ml: predictedPrice,
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

    // Replace the generatePredictions call with generateMLPredictions
    const predictions = StockPredictor.generateMLPredictions(historicalData, sentimentScore, currentPrice, newsData)

    console.log(`Generated ML predictions for ${symbol}:`, {
      currentPrice,
      sentimentScore,
      predictionsCount: predictions.length,
      avgConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
      mlModelsUsed: ["Linear Regression", "Neural Network", "ARIMA"],
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
