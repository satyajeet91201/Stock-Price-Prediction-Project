import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()

  try {
    // Try to fetch real data from Finnhub API
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)

    if (response.ok) {
      const data = await response.json()

      // Check if we got valid data
      if (data.c && data.c > 0) {
        const stockData = {
          symbol: symbol,
          price: data.c,
          change: data.d || 0,
          changePercent: data.dp || 0,
          high: data.h || data.c,
          low: data.l || data.c,
          open: data.o || data.c,
          previousClose: data.pc || data.c,
          timestamp: data.t || Math.floor(Date.now() / 1000),
          isRealData: true,
        }

        console.log(`Real data fetched for ${symbol}:`, stockData)
        return NextResponse.json(stockData)
      }
    }

    // Fallback to realistic mock data if API fails or returns invalid data
    console.log(`API failed for ${symbol}, using realistic mock data`)
    return NextResponse.json(generateRealisticStockData(symbol))
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error)
    return NextResponse.json(generateRealisticStockData(symbol))
  }
}

// Generate realistic stock data with market-like behavior
function generateRealisticStockData(symbol: string) {
  const basePrice = getBasePriceForSymbol(symbol)

  // Generate realistic daily change (most days are small moves)
  const randomFactor = Math.random()
  let changePercent: number

  if (randomFactor < 0.6) {
    // 60% chance of small move (±2%)
    changePercent = (Math.random() - 0.5) * 4
  } else if (randomFactor < 0.9) {
    // 30% chance of medium move (±5%)
    changePercent = (Math.random() - 0.5) * 10
  } else {
    // 10% chance of large move (±10%)
    changePercent = (Math.random() - 0.5) * 20
  }

  const change = (basePrice * changePercent) / 100
  const currentPrice = basePrice + change

  // Generate realistic intraday high/low
  const volatility = Math.abs(change) + basePrice * (0.005 + Math.random() * 0.015)
  const high = currentPrice + Math.random() * volatility
  const low = currentPrice - Math.random() * volatility
  const open = basePrice + (Math.random() - 0.5) * volatility * 0.5

  return {
    symbol: symbol,
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    high: Math.round(high * 100) / 100,
    low: Math.round(low * 100) / 100,
    open: Math.round(open * 100) / 100,
    previousClose: Math.round(basePrice * 100) / 100,
    timestamp: Math.floor(Date.now() / 1000),
    isRealData: false,
  }
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
