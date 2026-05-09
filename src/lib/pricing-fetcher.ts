import * as cheerio from 'cheerio';
import { ToolId } from './pricing';

// In production, this should come from process.env.GEMINI_API_KEY
const GEMINI_API_KEY = "AIzaSyDrDjYpgA3q9r-LRBvjolYs4JOCjgm-D3s";

export interface RealPricing {
  individual_monthly_price: number | null;
  team_monthly_price_per_user: number | null;
  currency: string;
}

// Map tools to their original official pricing URLs
export const TOOL_URLS: Record<ToolId, string> = {
  "chatgpt-plus": "https://openai.com/chatgpt/pricing/",
  "chatgpt-team": "https://openai.com/chatgpt/pricing/",
  "claude-pro": "https://www.anthropic.com/pricing",
  "claude-team": "https://www.anthropic.com/pricing",
  "cursor": "https://www.cursor.com/pricing",
  "github-copilot": "https://github.com/pricing",
  "gemini-advanced": "https://gemini.google.com/advanced",
  "perplexity-pro": "https://www.perplexity.ai/pro",
  "other": ""
};

/**
 * Advanced Algorithm for Fetching Real Subscription Fees of AI Tools.
 * It bypasses simple static scraping by fetching the HTML, cleaning it,
 * and leveraging Gemini 1.5 Flash to intelligently extract the exact pricing numbers.
 */
export async function fetchRealSubscriptionFee(url: string, toolName: string): Promise<RealPricing | null> {
  if (!url) return null;
  
  try {
    console.log(`[Pricing Engine] Fetching live pricing from ${url}...`);
    // 1. Fetch raw HTML from the pricing page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
    }

    const html = await response.text();
    
    // 2. Parse and clean HTML using Cheerio
    const $ = cheerio.load(html);
    
    // Remove unnecessary elements to save tokens
    $('script, style, noscript, iframe, svg, img, path, nav, footer').remove();
    
    // Extract text and normalize whitespace
    const pageText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000); // 15k limit for prompt efficiency

    // 3. Use LLM Data Extraction Engine
    const prompt = `
      You are an elite Pricing Data Extraction Engine. 
      Below is the raw text extracted from the official pricing page of the AI tool: "${toolName}".
      
      Task: Find the standard MONTHLY subscription fee for an individual "Pro" or "Plus" tier, and the "Team" or "Business" tier if available. 
      (Ignore annual discounted prices, we want the month-to-month price).
      
      Return ONLY a valid JSON object with this exact format, with no markdown formatting (\`\`\`json) or extra text:
      {
        "individual_monthly_price": 20,
        "team_monthly_price_per_user": 30,
        "currency": "USD"
      }
      
      If you absolutely cannot find the exact price in the text, use your internal knowledge base to fill in the accurate current pricing for ${toolName}.
      
      PAGE TEXT:
      ${pageText}
    `;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1
        }
      })
    });

    const data = await geminiResponse.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (textResult) {
      // 4. Clean and parse the JSON output
      const cleanJsonStr = textResult.replace(/```json/i, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonStr) as RealPricing;
      console.log(`[Pricing Engine] Successfully extracted live pricing for ${toolName}:`, parsedData);
      return parsedData;
    }
    
    return null;

  } catch (error) {
    console.log(`[Pricing Engine] Failed extracting live pricing for ${toolName}, will use fallback.`);
    return null;
  }
}

/**
 * Fetch live pricing concurrently for multiple tools
 */
export async function getLivePricingMap(tools: ToolId[]) {
  const uniqueTools = Array.from(new Set(tools)).filter(t => t !== 'other');
  
  const results = await Promise.all(
    uniqueTools.map(async (tool) => {
      const url = TOOL_URLS[tool];
      const liveData = await fetchRealSubscriptionFee(url, tool);
      return { tool, liveData };
    })
  );

  const map: Record<string, RealPricing | null> = {};
  results.forEach(res => {
    map[res.tool] = res.liveData;
  });
  
  return map;
}
