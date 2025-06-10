import { type NextRequest, NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

// Advanced sentiment analysis function
function analyzeSentiment(text: string): { sentiment: "positive" | "negative" | "neutral"; score: number } {
  const positiveWords = [
    "buy",
    "bull",
    "bullish",
    "gain",
    "gains",
    "growth",
    "increase",
    "profit",
    "profits",
    "rise",
    "rising",
    "strong",
    "up",
    "upgrade",
    "positive",
    "beat",
    "beats",
    "outperform",
    "rally",
    "surge",
    "soar",
    "breakthrough",
    "success",
    "excellent",
    "outstanding",
    "boost",
    "momentum",
    "optimistic",
    "confident",
    "expansion",
    "record",
    "milestone",
    "innovation",
    "breakthrough",
    "partnership",
    "acquisition",
    "merger",
    "dividend",
  ]

  const negativeWords = [
    "sell",
    "bear",
    "bearish",
    "loss",
    "losses",
    "decline",
    "decrease",
    "fall",
    "falling",
    "weak",
    "down",
    "downgrade",
    "negative",
    "miss",
    "misses",
    "underperform",
    "crash",
    "plunge",
    "drop",
    "concern",
    "worry",
    "risk",
    "threat",
    "disappointing",
    "warning",
    "cut",
    "reduce",
    "layoff",
    "bankruptcy",
    "debt",
    "lawsuit",
    "investigation",
    "scandal",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0
  const totalWords = words.length

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const totalSentimentWords = positiveCount + negativeCount
  if (totalSentimentWords === 0) {
    return { sentiment: "neutral", score: 0 }
  }

  // Calculate weighted score
  const score = (positiveCount - negativeCount) / Math.max(totalWords * 0.1, totalSentimentWords)

  if (score > 0.15) return { sentiment: "positive", score: Math.min(score, 1) }
  if (score < -0.15) return { sentiment: "negative", score: Math.max(score, -1) }
  return { sentiment: "neutral", score }
}

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()

  try {
    // Try to fetch real news from Finnhub
    const to = new Date().toISOString().split("T")[0]
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
    )

    if (response.ok) {
      const newsData = await response.json()

      if (Array.isArray(newsData) && newsData.length > 0) {
        const newsWithSentiment = newsData.slice(0, 10).map((article: any) => {
          const sentimentAnalysis = analyzeSentiment((article.headline || "") + " " + (article.summary || ""))

          return {
            headline: article.headline || "No headline available",
            summary: article.summary || "No summary available",
            url: article.url || "#",
            datetime: article.datetime || Date.now() / 1000,
            sentiment: sentimentAnalysis.sentiment,
            score: sentimentAnalysis.score,
            isRealData: true,
          }
        })

        console.log(`Real news data fetched for ${symbol}: ${newsWithSentiment.length} articles`)
        return NextResponse.json(newsWithSentiment)
      }
    }

    // Fallback to realistic mock news
    console.log(`News API failed for ${symbol}, using realistic mock news`)
    return NextResponse.json(generateRealisticNews(symbol))
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error)
    return NextResponse.json(generateRealisticNews(symbol))
  }
}

function generateRealisticNews(symbol: string) {
  const companyNames: { [key: string]: string } = {
    AAPL: "Apple",
    GOOGL: "Google",
    MSFT: "Microsoft",
    TSLA: "Tesla",
    AMZN: "Amazon",
    NVDA: "NVIDIA",
    META: "Meta",
    NFLX: "Netflix",
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "Tata Consultancy Services",
    "HDFCBANK.NS": "HDFC Bank",
    "INFY.NS": "Infosys",
    "ICICIBANK.NS": "ICICI Bank",
    "BHARTIARTL.NS": "Bharti Airtel",
    "ITC.NS": "ITC",
    "MARUTI.NS": "Maruti Suzuki",
  }

  const companyName = companyNames[symbol] || symbol.replace(".NS", "")

  const newsTemplates = [
    {
      headline: `${companyName} Reports Strong Q3 Earnings, Beats Analyst Expectations`,
      summary: `${companyName} delivered exceptional quarterly results with revenue growth of 15% YoY and improved profit margins, surpassing Wall Street estimates.`,
      sentiment: "positive" as const,
    },
    {
      headline: `${companyName} Announces Major AI Innovation Partnership`,
      summary: `The company unveiled a strategic partnership to integrate advanced AI technologies, positioning itself for future growth in emerging markets.`,
      sentiment: "positive" as const,
    },
    {
      headline: `Analysts Upgrade ${companyName} Stock Rating to 'Strong Buy'`,
      summary: `Multiple investment firms raised their price targets citing strong fundamentals, market leadership, and robust growth prospects.`,
      sentiment: "positive" as const,
    },
    {
      headline: `${companyName} Faces Regulatory Challenges in Key Markets`,
      summary: `The company is navigating increased regulatory scrutiny which may impact operations and growth strategies in several regions.`,
      sentiment: "negative" as const,
    },
    {
      headline: `${companyName} Stock Shows Volatility Amid Market Uncertainty`,
      summary: `Shares experienced fluctuations as investors weigh various market factors including inflation concerns and global economic indicators.`,
      sentiment: "neutral" as const,
    },
    {
      headline: `${companyName} Expands Global Operations with $2B Investment`,
      summary: `The company announced significant capital investment to expand manufacturing capabilities and enter new international markets.`,
      sentiment: "positive" as const,
    },
    {
      headline: `${companyName} Commits to Carbon Neutrality by 2030`,
      summary: `New sustainability initiatives include renewable energy adoption and green technology development as part of ESG strategy.`,
      sentiment: "positive" as const,
    },
    {
      headline: `Market Analysts Review ${companyName} Performance Metrics`,
      summary: `Industry experts analyze recent performance indicators and provide outlook for the coming quarters based on market trends.`,
      sentiment: "neutral" as const,
    },
    {
      headline: `${companyName} Launches Revolutionary Product Line`,
      summary: `The company introduced innovative products featuring cutting-edge technology, expected to capture significant market share.`,
      sentiment: "positive" as const,
    },
    {
      headline: `${companyName} Reports Supply Chain Disruptions Impact`,
      summary: `Global supply chain challenges have affected production schedules and may influence short-term financial performance.`,
      sentiment: "negative" as const,
    },
  ]

  const selectedNews = []
  const now = Math.floor(Date.now() / 1000)

  for (let i = 0; i < 8; i++) {
    const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
    const sentimentAnalysis = analyzeSentiment(template.headline + " " + template.summary)

    selectedNews.push({
      headline: template.headline,
      summary: template.summary,
      url: `https://example.com/news/${symbol.toLowerCase()}-${i}`,
      datetime: now - i * 3600 * 6, // 6 hours apart
      sentiment: sentimentAnalysis.sentiment,
      score: sentimentAnalysis.score,
      isRealData: false,
    })
  }

  return selectedNews
}
