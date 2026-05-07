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
}

// Monthly prices (using the standard monthly or annual-equivalent from form)
export const TOOL_PRICING: Record<string, { name: string, basePrice: number, perUser: boolean, minSeats?: number }> = {
  "chatgpt-plus": { name: "ChatGPT Plus", basePrice: 20, perUser: false },
  "chatgpt-team": { name: "ChatGPT Team", basePrice: 30, perUser: true, minSeats: 2 },
  "claude-pro": { name: "Claude Pro", basePrice: 20, perUser: false },
  "claude-team": { name: "Claude Team", basePrice: 30, perUser: true, minSeats: 5 },
  "cursor": { name: "Cursor", basePrice: 20, perUser: true },
  "github-copilot": { name: "GitHub Copilot", basePrice: 19, perUser: true },
  "gemini-advanced": { name: "Gemini Advanced", basePrice: 20, perUser: false },
  "perplexity-pro": { name: "Perplexity Pro", basePrice: 20, perUser: false },
};

export function generateAuditReport(input: AuditInput): AuditReport {
  let currentEstimatedSpend = 0;
  const recommendations: Recommendation[] = [];
  let optimizedTools = [...input.tools];
  
  // 1. Calculate current estimated spend
  input.tools.forEach(tool => {
    const pricing = TOOL_PRICING[tool];
    if (pricing) {
      if (pricing.perUser) {
        const seats = Math.max(pricing.minSeats || 1, input.teamSize);
        currentEstimatedSpend += pricing.basePrice * seats;
      } else {
        currentEstimatedSpend += pricing.basePrice * (input.teamSize); // Assuming individual accounts per team member if not "Team" plan
      }
    }
  });

  // If user provided a specific spend that is higher, we might use that, but let's stick to estimated for savings logic.
  // Actually, for individual plans (like ChatGPT Plus), a team of 5 means 5 * $20 = $100.
  
  let totalSavingsMonthly = 0;

  // Rule 1: Seat Floor Trap (ChatGPT Team and Claude Team)
  if (input.tools.includes("claude-team") && input.teamSize < 5) {
    const currentCost = 5 * 30; // $150
    const optimizedCost = input.teamSize * 20; // Switch to Claude Pro
    const savings = currentCost - optimizedCost;
    recommendations.push({
      title: "Claude Team Seat Minimum Trap",
      description: `Claude Team requires 5 seats minimum ($150/mo). For a team of ${input.teamSize}, switching to individual Claude Pro accounts saves money.`,
      savingsMonthly: savings,
      type: "seat-trap"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "claude-team");
    if (!optimizedTools.includes("claude-pro")) optimizedTools.push("claude-pro");
  }

  if (input.tools.includes("chatgpt-team") && input.teamSize < 2) {
    const currentCost = 2 * 30; // $60
    const optimizedCost = input.teamSize * 20; // Switch to ChatGPT Plus
    const savings = currentCost - optimizedCost;
    recommendations.push({
      title: "ChatGPT Team Seat Minimum",
      description: "ChatGPT Team requires 2 seats minimum. As a solo user, switching to ChatGPT Plus is more cost-effective.",
      savingsMonthly: savings,
      type: "seat-trap"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "chatgpt-team");
    if (!optimizedTools.includes("chatgpt-plus")) optimizedTools.push("chatgpt-plus");
  }

  // Rule 2: The Model Double-Dip
  const hasChatGptPlus = input.tools.includes("chatgpt-plus");
  const hasClaudePro = input.tools.includes("claude-pro");
  if (hasChatGptPlus && hasClaudePro) {
    // Current cost: $20 + $20 = $40 per user
    // Optimized: Perplexity Pro $20 per user
    const savings = 20 * input.teamSize;
    recommendations.push({
      title: "The Model Double-Dip",
      description: "You are paying for both ChatGPT Plus and Claude Pro. Consider using a model aggregator like Perplexity Pro to access both for a single $20/mo subscription.",
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "chatgpt-plus" && t !== "claude-pro");
    if (!optimizedTools.includes("perplexity-pro")) optimizedTools.push("perplexity-pro");
  }

  // Rule 3: The Coding Double-Dip
  const codingTools = input.tools.filter(t => ["cursor", "github-copilot"].includes(t));
  if (codingTools.length > 1) {
    // Paying for both Cursor ($20) and Copilot ($19)
    const savings = 19 * input.teamSize; // Eliminate Copilot
    recommendations.push({
      title: "Redundant Coding Assistants",
      description: "You have overlapping IDE subscriptions (Cursor + GitHub Copilot). Consolidating to a single tool will eliminate redundant spend.",
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t !== "github-copilot");
  }

  // Calculate final numbers
  // Fallback to user's reported spend if our estimate is 0
  const baseSpend = currentEstimatedSpend > 0 ? currentEstimatedSpend : input.monthlySpend;
  const optimizedSpend = Math.max(0, baseSpend - totalSavingsMonthly);
  
  // Safe percentage calculation
  const savingsPercentage = baseSpend > 0 ? Math.round((totalSavingsMonthly / baseSpend) * 100) : 0;

  return {
    currentEstimatedSpend: baseSpend,
    optimizedSpend,
    totalSavingsMonthly,
    totalSavingsAnnual: totalSavingsMonthly * 12,
    savingsPercentage,
    recommendations,
    optimizedTools
  };
}
