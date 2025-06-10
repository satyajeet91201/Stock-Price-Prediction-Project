import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()

  try {
    // Try to fetch real historical data from Finnhub
    const to = Math.floor(Date.now() / 1000)
    const from = to - 30 * 24 * 60 * 60 // 30 days ago

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
    )

    if (response.ok) {
      const data = await response.json()

      if (data.s === "ok" && data.t && Array.isArray(data.t) && data.t.length > 0) {
        const historicalData = data.t.map((timestamp: number, index: number) => ({
          t: timestamp,
          o: data.o[index],
          h: data.h[index],
          l: data.l[index],
          c: data.c[index],
          v: data.v[index],
          isRealData: true,
        }))

        console.log(`Real historical data fetched for ${symbol}: ${historicalData.length} points`)
        return NextResponse.json(historicalData)
      }
    }

    // Fallback to mock data
    console.log(`Historical API failed for ${symbol}, using mock data`)
    return NextResponse.json(generateRealisticHistoricalData(symbol))
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)
    return NextResponse.json(generateRealisticHistoricalData(symbol))
  }
}

// Generate realistic historical data with proper market patterns
function generateRealisticHistoricalData(symbol: string) {
  const data = []
  const basePrice = getBasePriceForSymbol(symbol)
  const now = Math.floor(Date.now() / 1000)

  // Create a realistic price trend over 30 days
  const trendDirection = Math.random() > 0.5 ? 1 : -1 // Overall trend up or down
  const trendStrength = 0.02 + Math.random() * 0.03 // 2-5% total trend

  for (let i = 29; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60
    const dayProgress = (29 - i) / 29 // 0 to 1

    // Apply overall trend
    const trendEffect = trendDirection * trendStrength * dayProgress

    // Add some random daily volatility
    const dailyVolatility = (Math.random() - 0.5) * 0.04 // ±2% daily volatility

    // Add some weekly patterns (stocks often have weekly cycles)
    const weeklyPattern = Math.sin(dayProgress * Math.PI * 4) * 0.01

    const priceMultiplier = 1 + trendEffect + dailyVolatility + weeklyPattern
    const dayPrice = basePrice * priceMultiplier

    // Generate OHLC data with realistic relationships
    const volatility = dayPrice * (0.005 + Math.random() * 0.015) // 0.5-2% intraday volatility

    const open = dayPrice + (Math.random() - 0.5) * volatility
    const close = dayPrice + (Math.random() - 0.5) * volatility
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility

    // Ensure realistic volume (higher volume on bigger price moves)
    const priceChange = Math.abs(close - open) / open
    const baseVolume = getBaseVolumeForSymbol(symbol)
    const volume = Math.floor(baseVolume * (1 + priceChange * 5) * (0.5 + Math.random()))

    data.push({
      t: timestamp,
      o: Math.round(open * 100) / 100,
      h: Math.round(high * 100) / 100,
      l: Math.round(low * 100) / 100,
      c: Math.round(close * 100) / 100,
      v: volume,
      isRealData: false,
    })
  }

  return data
}

function getBasePriceForSymbol(symbol: string): number {
  // US Stocks
  const usPrices: { [key: string]: number } = {
    AAPL: 175.5,
    GOOGL: 140.25,
    MSFT: 380.75,
    TSLA: 248.9,
    AMZN: 145.3,
    NVDA: 485.6,
    META: 325.8,
    NFLX: 450.25,
  }

  // Indian Stocks (in INR)
  const indianPrices: { [key: string]: number } = {
    "RELIANCE.NS": 2450.75,
    "TCS.NS": 3520.5,
    "HDFCBANK.NS": 1650.25,
    "INFY.NS": 1485.6,
    "HINDUNILVR.NS": 2680.4,
    "ICICIBANK.NS": 945.8,
    "KOTAKBANK.NS": 1820.3,
    "SBIN.NS": 575.9,
    "BHARTIARTL.NS": 865.45,
    "ITC.NS": 415.2,
    "ASIANPAINT.NS": 3250.75,
    "MARUTI.NS": 9850.6,
    "AXISBANK.NS": 1025.4,
    "LT.NS": 2180.85,
    "HCLTECH.NS": 1165.3,
    "WIPRO.NS": 425.75,
    "NESTLEIND.NS": 22500.5,
    "ULTRACEMCO.NS": 8450.25,
    "BAJFINANCE.NS": 6850.9,
    "TITAN.NS": 3180.45,
    "SUNPHARMA.NS": 1085.6,
    "POWERGRID.NS": 245.8,
    "NTPC.NS": 185.45,
    "TECHM.NS": 1145.7,
    "ONGC.NS": 165.3,
    "TATAMOTORS.NS": 485.9,
    "TATASTEEL.NS": 125.45,
    "BAJAJFINSV.NS": 1580.75,
    "HDFCLIFE.NS": 685.4,
    "BRITANNIA.NS": 4850.6,
    "COALINDIA.NS": 285.75,
    "DIVISLAB.NS": 3650.8,
    "DRREDDY.NS": 4950.45,
    "EICHERMOT.NS": 3485.9,
    "GRASIM.NS": 1850.25,
    "HEROMOTOCO.NS": 2750.6,
    "HINDALCO.NS": 485.4,
    "INDUSINDBK.NS": 1285.75,
    "JSWSTEEL.NS": 785.3,
    "M&M.NS": 1485.9,
    "SBILIFE.NS": 1385.45,
    "SHREECEM.NS": 26500.8,
    "TATACONSUM.NS": 825.6,
    "UPL.NS": 685.75,
    "VEDL.NS": 285.4,
    "ZOMATO.NS": 85.6,
    "PAYTM.NS": 685.75,
    "NYKAA.NS": 185.4,
    "POLICYBZR.NS": 1285.9,
    "DMART.NS": 3850.45,
    "TRENT.NS": 1685.6,
    "TATACHEM.NS": 1085.75,
    "TATAELXSI.NS": 6850.4,
    "PERSISTENT.NS": 4850.9,
    "COFORGE.NS": 5485.45,
    "LTIM.NS": 4850.6,
  }

  // Check if it's an Indian stock
  if (symbol.includes(".NS")) {
    return indianPrices[symbol] || 500 + Math.random() * 2000
  }

  // US stock
  return usPrices[symbol] || 50 + Math.random() * 300
}

function getBaseVolumeForSymbol(symbol: string): number {
  // Indian stocks typically have higher volume numbers
  if (symbol.includes(".NS")) {
    const indianVolumes: { [key: string]: number } = {
      "RELIANCE.NS": 8000000,
      "TCS.NS": 3500000,
      "HDFCBANK.NS": 12000000,
      "INFY.NS": 8500000,
      "ICICIBANK.NS": 15000000,
      "SBIN.NS": 25000000,
      "BHARTIARTL.NS": 10000000,
      "ITC.NS": 20000000,
    }
    return indianVolumes[symbol] || 500000 + Math.random() * 5000000
  }

  // US stock volumes
  const usVolumes: { [key: string]: number } = {
    AAPL: 50000000,
    GOOGL: 25000000,
    MSFT: 30000000,
    TSLA: 80000000,
    NVDA: 45000000,
    META: 40000000,
  }

  return usVolumes[symbol] || 1000000 + Math.random() * 20000000
}
