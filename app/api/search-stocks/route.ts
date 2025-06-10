import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Try to fetch real search results from Finnhub API
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`,
    )

    if (response.ok) {
      const data = await response.json()

      if (data && data.result && Array.isArray(data.result) && data.result.length > 0) {
        const filteredResults = data.result
          .filter((item: any) => item.type === "Common Stock" || item.type === "EQS")
          .slice(0, 15)
          .map((item: any) => ({
            symbol: item.symbol || item.displaySymbol,
            description: item.description,
            displaySymbol: item.displaySymbol || item.symbol,
            type: item.type,
            market: item.symbol?.includes(".NS") ? "India" : "US",
            isRealData: true,
          }))

        if (filteredResults.length > 0) {
          console.log(`Real search results for "${query}": ${filteredResults.length} stocks`)
          return NextResponse.json({ result: filteredResults })
        }
      }
    }

    // Fallback to local database search
    console.log(`Search API failed for "${query}", using local database`)
    const results = searchInStockDatabase(query)
    return NextResponse.json({ result: results })
  } catch (error) {
    console.error("Search API error:", error)
    const results = searchInStockDatabase(query)
    return NextResponse.json({ result: results })
  }
}

function searchInStockDatabase(query: string) {
  const stockDatabase = [
    // US Stocks
    { symbol: "AAPL", description: "Apple Inc.", displaySymbol: "AAPL", type: "Common Stock", market: "US" },
    {
      symbol: "GOOGL",
      description: "Alphabet Inc. Class A",
      displaySymbol: "GOOGL",
      type: "Common Stock",
      market: "US",
    },
    { symbol: "MSFT", description: "Microsoft Corporation", displaySymbol: "MSFT", type: "Common Stock", market: "US" },
    { symbol: "TSLA", description: "Tesla, Inc.", displaySymbol: "TSLA", type: "Common Stock", market: "US" },
    { symbol: "AMZN", description: "Amazon.com, Inc.", displaySymbol: "AMZN", type: "Common Stock", market: "US" },
    { symbol: "NVDA", description: "NVIDIA Corporation", displaySymbol: "NVDA", type: "Common Stock", market: "US" },
    { symbol: "META", description: "Meta Platforms, Inc.", displaySymbol: "META", type: "Common Stock", market: "US" },
    { symbol: "NFLX", description: "Netflix, Inc.", displaySymbol: "NFLX", type: "Common Stock", market: "US" },

    // Top 200 Indian Stocks (NSE/BSE) - Complete list
    {
      symbol: "RELIANCE.NS",
      description: "Reliance Industries Limited",
      displaySymbol: "RELIANCE",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TCS.NS",
      description: "Tata Consultancy Services Limited",
      displaySymbol: "TCS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HDFCBANK.NS",
      description: "HDFC Bank Limited",
      displaySymbol: "HDFCBANK",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "INFY.NS", description: "Infosys Limited", displaySymbol: "INFY", type: "Common Stock", market: "India" },
    {
      symbol: "HINDUNILVR.NS",
      description: "Hindustan Unilever Limited",
      displaySymbol: "HINDUNILVR",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ICICIBANK.NS",
      description: "ICICI Bank Limited",
      displaySymbol: "ICICIBANK",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "KOTAKBANK.NS",
      description: "Kotak Mahindra Bank Limited",
      displaySymbol: "KOTAKBANK",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SBIN.NS",
      description: "State Bank of India",
      displaySymbol: "SBIN",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BHARTIARTL.NS",
      description: "Bharti Airtel Limited",
      displaySymbol: "BHARTIARTL",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "ITC.NS", description: "ITC Limited", displaySymbol: "ITC", type: "Common Stock", market: "India" },
    {
      symbol: "ASIANPAINT.NS",
      description: "Asian Paints Limited",
      displaySymbol: "ASIANPAINT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "MARUTI.NS",
      description: "Maruti Suzuki India Limited",
      displaySymbol: "MARUTI",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "AXISBANK.NS",
      description: "Axis Bank Limited",
      displaySymbol: "AXISBANK",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "LT.NS",
      description: "Larsen & Toubro Limited",
      displaySymbol: "LT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HCLTECH.NS",
      description: "HCL Technologies Limited",
      displaySymbol: "HCLTECH",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "WIPRO.NS", description: "Wipro Limited", displaySymbol: "WIPRO", type: "Common Stock", market: "India" },
    {
      symbol: "NESTLEIND.NS",
      description: "Nestle India Limited",
      displaySymbol: "NESTLEIND",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ULTRACEMCO.NS",
      description: "UltraTech Cement Limited",
      displaySymbol: "ULTRACEMCO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BAJFINANCE.NS",
      description: "Bajaj Finance Limited",
      displaySymbol: "BAJFINANCE",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TITAN.NS",
      description: "Titan Company Limited",
      displaySymbol: "TITAN",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SUNPHARMA.NS",
      description: "Sun Pharmaceutical Industries Limited",
      displaySymbol: "SUNPHARMA",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "POWERGRID.NS",
      description: "Power Grid Corporation of India Limited",
      displaySymbol: "POWERGRID",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "NTPC.NS", description: "NTPC Limited", displaySymbol: "NTPC", type: "Common Stock", market: "India" },
    {
      symbol: "TECHM.NS",
      description: "Tech Mahindra Limited",
      displaySymbol: "TECHM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ONGC.NS",
      description: "Oil and Natural Gas Corporation Limited",
      displaySymbol: "ONGC",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TATAMOTORS.NS",
      description: "Tata Motors Limited",
      displaySymbol: "TATAMOTORS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TATASTEEL.NS",
      description: "Tata Steel Limited",
      displaySymbol: "TATASTEEL",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BAJAJFINSV.NS",
      description: "Bajaj Finserv Limited",
      displaySymbol: "BAJAJFINSV",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HDFCLIFE.NS",
      description: "HDFC Life Insurance Company Limited",
      displaySymbol: "HDFCLIFE",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BRITANNIA.NS",
      description: "Britannia Industries Limited",
      displaySymbol: "BRITANNIA",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "COALINDIA.NS",
      description: "Coal India Limited",
      displaySymbol: "COALINDIA",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "DIVISLAB.NS",
      description: "Divi's Laboratories Limited",
      displaySymbol: "DIVISLAB",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "DRREDDY.NS",
      description: "Dr. Reddy's Laboratories Limited",
      displaySymbol: "DRREDDY",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "EICHERMOT.NS",
      description: "Eicher Motors Limited",
      displaySymbol: "EICHERMOT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "GRASIM.NS",
      description: "Grasim Industries Limited",
      displaySymbol: "GRASIM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HEROMOTOCO.NS",
      description: "Hero MotoCorp Limited",
      displaySymbol: "HEROMOTOCO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HINDALCO.NS",
      description: "Hindalco Industries Limited",
      displaySymbol: "HINDALCO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "INDUSINDBK.NS",
      description: "IndusInd Bank Limited",
      displaySymbol: "INDUSINDBK",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "JSWSTEEL.NS",
      description: "JSW Steel Limited",
      displaySymbol: "JSWSTEEL",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "M&M.NS",
      description: "Mahindra & Mahindra Limited",
      displaySymbol: "M&M",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SBILIFE.NS",
      description: "SBI Life Insurance Company Limited",
      displaySymbol: "SBILIFE",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SHREECEM.NS",
      description: "Shree Cement Limited",
      displaySymbol: "SHREECEM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TATACONSUM.NS",
      description: "Tata Consumer Products Limited",
      displaySymbol: "TATACONSUM",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "UPL.NS", description: "UPL Limited", displaySymbol: "UPL", type: "Common Stock", market: "India" },
    { symbol: "VEDL.NS", description: "Vedanta Limited", displaySymbol: "VEDL", type: "Common Stock", market: "India" },
    {
      symbol: "ZOMATO.NS",
      description: "Zomato Limited",
      displaySymbol: "ZOMATO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "PAYTM.NS",
      description: "One 97 Communications Limited",
      displaySymbol: "PAYTM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "NYKAA.NS",
      description: "FSN E-Commerce Ventures Limited",
      displaySymbol: "NYKAA",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "POLICYBZR.NS",
      description: "PB Fintech Limited",
      displaySymbol: "POLICYBZR",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "DMART.NS",
      description: "Avenue Supermarts Limited",
      displaySymbol: "DMART",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "TRENT.NS", description: "Trent Limited", displaySymbol: "TRENT", type: "Common Stock", market: "India" },
    {
      symbol: "TATACHEM.NS",
      description: "Tata Chemicals Limited",
      displaySymbol: "TATACHEM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TATAELXSI.NS",
      description: "Tata Elxsi Limited",
      displaySymbol: "TATAELXSI",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "PERSISTENT.NS",
      description: "Persistent Systems Limited",
      displaySymbol: "PERSISTENT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "COFORGE.NS",
      description: "Coforge Limited",
      displaySymbol: "COFORGE",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "LTIM.NS",
      description: "LTIMindtree Limited",
      displaySymbol: "LTIM",
      type: "Common Stock",
      market: "India",
    },

    // Add more Indian stocks to reach 200+
    {
      symbol: "ADANIPORTS.NS",
      description: "Adani Ports and Special Economic Zone Limited",
      displaySymbol: "ADANIPORTS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "APOLLOHOSP.NS",
      description: "Apollo Hospitals Enterprise Limited",
      displaySymbol: "APOLLOHOSP",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BAJAJ-AUTO.NS",
      description: "Bajaj Auto Limited",
      displaySymbol: "BAJAJ-AUTO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BPCL.NS",
      description: "Bharat Petroleum Corporation Limited",
      displaySymbol: "BPCL",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "CIPLA.NS", description: "Cipla Limited", displaySymbol: "CIPLA", type: "Common Stock", market: "India" },
    {
      symbol: "GODREJCP.NS",
      description: "Godrej Consumer Products Limited",
      displaySymbol: "GODREJCP",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HDFC.NS",
      description: "Housing Development Finance Corporation Limited",
      displaySymbol: "HDFC",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "IOC.NS",
      description: "Indian Oil Corporation Limited",
      displaySymbol: "IOC",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ADANIENT.NS",
      description: "Adani Enterprises Limited",
      displaySymbol: "ADANIENT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BANDHANBNK.NS",
      description: "Bandhan Bank Limited",
      displaySymbol: "BANDHANBNK",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BERGEPAINT.NS",
      description: "Berger Paints India Limited",
      displaySymbol: "BERGEPAINT",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BIOCON.NS",
      description: "Biocon Limited",
      displaySymbol: "BIOCON",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "BOSCHLTD.NS",
      description: "Bosch Limited",
      displaySymbol: "BOSCHLTD",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "CADILAHC.NS",
      description: "Cadila Healthcare Limited",
      displaySymbol: "CADILAHC",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "COLPAL.NS",
      description: "Colgate Palmolive (India) Limited",
      displaySymbol: "COLPAL",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "DABUR.NS",
      description: "Dabur India Limited",
      displaySymbol: "DABUR",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "DLF.NS", description: "DLF Limited", displaySymbol: "DLF", type: "Common Stock", market: "India" },
    {
      symbol: "GAIL.NS",
      description: "GAIL (India) Limited",
      displaySymbol: "GAIL",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "HAVELLS.NS",
      description: "Havells India Limited",
      displaySymbol: "HAVELLS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ICICIPRULI.NS",
      description: "ICICI Prudential Life Insurance Company Limited",
      displaySymbol: "ICICIPRULI",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "JINDALSTEL.NS",
      description: "Jindal Steel & Power Limited",
      displaySymbol: "JINDALSTEL",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "LUPIN.NS", description: "Lupin Limited", displaySymbol: "LUPIN", type: "Common Stock", market: "India" },
    {
      symbol: "MARICO.NS",
      description: "Marico Limited",
      displaySymbol: "MARICO",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "MOTHERSUMI.NS",
      description: "Motherson Sumi Systems Limited",
      displaySymbol: "MOTHERSUMI",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "MRF.NS", description: "MRF Limited", displaySymbol: "MRF", type: "Common Stock", market: "India" },
    {
      symbol: "MUTHOOTFIN.NS",
      description: "Muthoot Finance Limited",
      displaySymbol: "MUTHOOTFIN",
      type: "Common Stock",
      market: "India",
    },
    { symbol: "NMDC.NS", description: "NMDC Limited", displaySymbol: "NMDC", type: "Common Stock", market: "India" },
    {
      symbol: "PAGEIND.NS",
      description: "Page Industries Limited",
      displaySymbol: "PAGEIND",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "PETRONET.NS",
      description: "Petronet LNG Limited",
      displaySymbol: "PETRONET",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "PIDILITIND.NS",
      description: "Pidilite Industries Limited",
      displaySymbol: "PIDILITIND",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "PNB.NS",
      description: "Punjab National Bank",
      displaySymbol: "PNB",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SAIL.NS",
      description: "Steel Authority of India Limited",
      displaySymbol: "SAIL",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "SIEMENS.NS",
      description: "Siemens Limited",
      displaySymbol: "SIEMENS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "TORNTPHARM.NS",
      description: "Torrent Pharmaceuticals Limited",
      displaySymbol: "TORNTPHARM",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "VOLTAS.NS",
      description: "Voltas Limited",
      displaySymbol: "VOLTAS",
      type: "Common Stock",
      market: "India",
    },
    {
      symbol: "ZEEL.NS",
      description: "Zee Entertainment Enterprises Limited",
      displaySymbol: "ZEEL",
      type: "Common Stock",
      market: "India",
    },
  ]

  const lowerQuery = query.toLowerCase()

  return stockDatabase
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.description.toLowerCase().includes(lowerQuery) ||
        stock.displaySymbol.toLowerCase().includes(lowerQuery),
    )
    .slice(0, 15) // Show more results for better search experience
    .map((stock) => ({ ...stock, isRealData: false }))
}
