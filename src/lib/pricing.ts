import { getLivePricingMap, RealPricing } from "./pricing-fetcher";

export type ToolId = 
  | "chatgpt-plus" 
  | "chatgpt-team" 
  | "claude-pro" 
  | "claude-team" 
  | "cursor" 
  | "github-copilot" 
  | "gemini-advanced" 
  | "perplexity-pro" 
  | "other";

export interface AuditInput {
  tools: ToolId[];
  teamSize: number;
  monthlySpend: number;
  primaryUseCase: string;
}

export interface Recommendation {
  title: string;
  description: string;
  savingsMonthly: number;
  type: "redundancy" | "tier-optimization" | "seat-trap";
}

export interface AuditReport {
  currentEstimatedSpend: number;
  optimizedSpend: number;
  totalSavingsMonthly: number;
  totalSavingsAnnual: number;
  savingsPercentage: number;
  recommendations: Recommendation[];
  optimizedTools: ToolId[];
  // Include the dynamic pricing map so the UI can show the live prices
  pricingMap: Record<string, { name: string, basePrice: number, perUser: boolean, minSeats?: number }>;
}

// Fallback static pricing (Used if dynamic fetch fails)
export const FALLBACK_PRICING: Record<string, { name: string, basePrice: number, perUser: boolean, minSeats?: number }> = {
  "chatgpt-plus": { name: "ChatGPT Plus", basePrice: 20, perUser: true }, 
  "chatgpt-team": { name: "ChatGPT Team", basePrice: 30, perUser: true, minSeats: 2 },
  "claude-pro": { name: "Claude Pro", basePrice: 20, perUser: true },
  "claude-team": { name: "Claude Team", basePrice: 30, perUser: true, minSeats: 5 },
  "cursor": { name: "Cursor", basePrice: 20, perUser: true },
  "github-copilot": { name: "GitHub Copilot", basePrice: 19, perUser: true },
  "gemini-advanced": { name: "Gemini Advanced", basePrice: 20, perUser: true },
  "perplexity-pro": { name: "Perplexity Pro", basePrice: 20, perUser: true },
};

/**
 * Async Audit Engine: Fetches real-time prices from original URLs before calculating.
 */
export async function generateAuditReport(input: AuditInput): Promise<AuditReport> {
  // 1. Fetch real-time pricing for the tools in the user's stack and potential optimization targets
  const toolsToFetch = Array.from(new Set([...input.tools, "chatgpt-plus", "claude-pro", "perplexity-pro"])) as ToolId[];
  const liveDataMap = await getLivePricingMap(toolsToFetch);

  // 2. Build the dynamic pricing map by merging live data with fallbacks
  const dynamicPricing = { ...FALLBACK_PRICING };
  
  for (const [tool, liveData] of Object.entries(liveDataMap)) {
    if (liveData && dynamicPricing[tool]) {
      // If the tool is a "team" variant, use the team price, otherwise individual
      if (tool.includes('team') && liveData.team_monthly_price_per_user) {
        dynamicPricing[tool].basePrice = liveData.team_monthly_price_per_user;
      } else if (liveData.individual_monthly_price) {
        dynamicPricing[tool].basePrice = liveData.individual_monthly_price;
      }
    }
  }

  let currentEstimatedSpend = 0;
  const recommendations: Recommendation[] = [];
  let optimizedTools = [...input.tools];
  let totalSavingsMonthly = 0;
  
  // 3. Calculate current estimated spend based on team size & live pricing
  input.tools.forEach(tool => {
    const pricing = dynamicPricing[tool];
    if (pricing) {
      if (pricing.minSeats) {
        const seats = Math.max(pricing.minSeats, input.teamSize);
        currentEstimatedSpend += pricing.basePrice * seats;
      } else {
        currentEstimatedSpend += pricing.basePrice * input.teamSize;
      }
    }
  });

  // Overwrite with user's reported spend if it's vastly different (shadow AI spend)
  let baseSpend = currentEstimatedSpend > 0 ? currentEstimatedSpend : input.monthlySpend;

  // --- Advanced Engine Rules ---

  // Rule 1: Seat Minimum Trap (Claude Team)
  if (input.tools.includes("claude-team") && input.teamSize < 5) {
    const currentCost = 5 * dynamicPricing["claude-team"].basePrice;
    const optimizedCost = input.teamSize * dynamicPricing["claude-pro"].basePrice;
    const savings = currentCost - optimizedCost;
    recommendations.push({
      title: "Claude Team Minimum Seat Trap",
      description: `Claude Team requires 5 seats minimum ($${currentCost}/mo). For your team of ${input.teamSize}, downgrading to individual Claude Pro accounts is much more cost-effective.`,
      savingsMonthly: savings,
      type: "seat-trap"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "claude-team");
    if (!optimizedTools.includes("claude-pro")) optimizedTools.push("claude-pro");
  }

  // Rule 2: Seat Minimum Trap (ChatGPT Team)
  if (input.tools.includes("chatgpt-team") && input.teamSize < 2) {
    const currentCost = 2 * dynamicPricing["chatgpt-team"].basePrice;
    const optimizedCost = input.teamSize * dynamicPricing["chatgpt-plus"].basePrice;
    const savings = currentCost - optimizedCost;
    recommendations.push({
      title: "ChatGPT Team Minimum Seat Trap",
      description: "ChatGPT Team requires 2 seats minimum. Since you have a team of 1, switching to ChatGPT Plus will save you money.",
      savingsMonthly: savings,
      type: "seat-trap"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "chatgpt-team");
    if (!optimizedTools.includes("chatgpt-plus")) optimizedTools.push("chatgpt-plus");
  }

  // Rule 3: The Ultimate Model Aggregator Swap
  const hasChatGpt = input.tools.includes("chatgpt-plus") || input.tools.includes("chatgpt-team");
  const hasClaude = input.tools.includes("claude-pro") || input.tools.includes("claude-team");
  
  if (hasChatGpt && hasClaude) {
    const gptCost = input.tools.includes("chatgpt-team") 
      ? Math.max(2, input.teamSize) * dynamicPricing["chatgpt-team"].basePrice 
      : input.teamSize * dynamicPricing["chatgpt-plus"].basePrice;
      
    const claudeCost = input.tools.includes("claude-team") 
      ? Math.max(5, input.teamSize) * dynamicPricing["claude-team"].basePrice 
      : input.teamSize * dynamicPricing["claude-pro"].basePrice;
    
    const combinedCurrentCost = gptCost + claudeCost;
    const perplexityCost = input.teamSize * dynamicPricing["perplexity-pro"].basePrice; 
    const savings = combinedCurrentCost - perplexityCost;
    
    recommendations.push({
      title: "The Ultimate Aggregator Swap",
      description: `You are paying for both OpenAI and Anthropic separately. By switching to Perplexity Pro ($${dynamicPricing["perplexity-pro"].basePrice}/mo), your team gets access to both GPT-4o AND Claude 3.5 Sonnet.`,
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => !["chatgpt-plus", "chatgpt-team", "claude-pro", "claude-team"].includes(t));
    if (!optimizedTools.includes("perplexity-pro")) optimizedTools.push("perplexity-pro");
  }

  // Rule 4: The Developer Double-Dip (Cursor vs Copilot)
  if (input.tools.includes("cursor") && input.tools.includes("github-copilot")) {
    const copilotCost = input.teamSize * dynamicPricing["github-copilot"].basePrice; 
    recommendations.push({
      title: "Redundant Coding Assistants",
      description: "You are paying for both Cursor and GitHub Copilot. Cursor has built-in AI autocomplete that replaces Copilot. Canceling Copilot eliminates redundant spend.",
      savingsMonthly: copilotCost,
      type: "redundancy"
    });
    totalSavingsMonthly += copilotCost;
    optimizedTools = optimizedTools.filter(t => t !== "github-copilot");
  }
  
  // Rule 5: Shadow AI Spend Detection
  if (input.monthlySpend > currentEstimatedSpend + 50) {
    const unaccounted = input.monthlySpend - currentEstimatedSpend;
    recommendations.push({
      title: "Shadow AI Spend Detected",
      description: `You reported spending $${input.monthlySpend}/mo, but your selected core stack only costs ~$${currentEstimatedSpend}/mo. You have ~$${unaccounted}/mo in "Shadow AI" spend.`,
      savingsMonthly: Math.round(unaccounted * 0.5), 
      type: "tier-optimization"
    });
    totalSavingsMonthly += Math.round(unaccounted * 0.5);
  }

  // Final Calculations
  const optimizedSpend = Math.max(0, baseSpend - totalSavingsMonthly);
  const savingsPercentage = baseSpend > 0 ? Math.round((totalSavingsMonthly / baseSpend) * 100) : 0;

  return {
    currentEstimatedSpend: baseSpend,
    optimizedSpend: Math.round(optimizedSpend),
    totalSavingsMonthly: Math.round(totalSavingsMonthly),
    totalSavingsAnnual: Math.round(totalSavingsMonthly * 12),
    savingsPercentage,
    recommendations,
    optimizedTools,
    pricingMap: dynamicPricing // return this so the UI can display the live fetched prices
  };
}
