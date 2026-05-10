import { AuditInput, ToolSelection } from "./types";

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
  optimizedTools: ToolSelection[];
}

export function generateAuditReport(input: AuditInput): AuditReport {
  let currentSpend = 0;
  const recommendations: Recommendation[] = [];
  let optimizedTools: ToolSelection[] = JSON.parse(JSON.stringify(input.tools));
  let totalSavingsMonthly = 0;

  // Calculate user's reported total spend
  input.tools.forEach(tool => {
    currentSpend += tool.monthlySpend;
  });

  // Rule 1: Claude Team Seat Minimum Trap
  const claudeTool = optimizedTools.find(t => t.toolId === "claude");
  if (claudeTool && claudeTool.planId === "team" && claudeTool.seats < 5) {
    // They are paying for 5 seats minimum ($150), but only have <5 users.
    const currentCost = claudeTool.monthlySpend > 0 ? claudeTool.monthlySpend : 150;
    const proCost = claudeTool.seats * 20; // Pro is $20
    const savings = currentCost - proCost;
    if (savings > 0) {
      recommendations.push({
        title: "Claude Team Minimum Seat Trap",
        description: `Claude Team requires 5 seats minimum ($150/mo floor). For ${claudeTool.seats} users, downgrade to individual Claude Pro accounts to save money.`,
        savingsMonthly: savings,
        type: "seat-trap"
      });
      totalSavingsMonthly += savings;
      claudeTool.planId = "pro";
      claudeTool.monthlySpend = proCost;
    }
  }

  // Rule 2: ChatGPT Team Seat Minimum Trap
  const gptTool = optimizedTools.find(t => t.toolId === "chatgpt");
  if (gptTool && gptTool.planId === "team" && gptTool.seats < 2) {
    const currentCost = gptTool.monthlySpend > 0 ? gptTool.monthlySpend : 60; // 2 seats * 30
    const plusCost = gptTool.seats * 20;
    const savings = currentCost - plusCost;
    if (savings > 0) {
      recommendations.push({
        title: "ChatGPT Team Overkill",
        description: `ChatGPT Team is designed for 2+ users. As a solo user, switch to ChatGPT Plus.`,
        savingsMonthly: savings,
        type: "seat-trap"
      });
      totalSavingsMonthly += savings;
      gptTool.planId = "plus";
      gptTool.monthlySpend = plusCost;
    }
  }

  // Rule 3: Cursor Teams Overspend
  const cursorTool = optimizedTools.find(t => t.toolId === "cursor");
  if (cursorTool && cursorTool.planId === "business" && cursorTool.seats <= 2) {
    const currentCost = cursorTool.monthlySpend > 0 ? cursorTool.monthlySpend : cursorTool.seats * 40;
    const proCost = cursorTool.seats * 20;
    const savings = currentCost - proCost;
    if (savings > 0) {
      recommendations.push({
        title: "Cursor Teams Overspend",
        description: `Cursor Teams ($40/user) is overkill for 1-2 users. Switch to Cursor Pro ($20/user) for the same core AI capabilities.`,
        savingsMonthly: savings,
        type: "tier-optimization"
      });
      totalSavingsMonthly += savings;
      cursorTool.planId = "pro";
      cursorTool.monthlySpend = proCost;
    }
  }

  // Rule 4: Copilot Business for Solo Dev
  const copilotTool = optimizedTools.find(t => t.toolId === "github-copilot");
  if (copilotTool && copilotTool.planId === "business" && copilotTool.seats === 1) {
    const currentCost = copilotTool.monthlySpend > 0 ? copilotTool.monthlySpend : 19;
    const indivCost = 10;
    const savings = currentCost - indivCost;
    if (savings > 0) {
      recommendations.push({
        title: "Copilot Business for Solo Dev",
        description: `Copilot Business is meant for enterprise policy control. A solo developer should use Copilot Individual.`,
        savingsMonthly: savings,
        type: "tier-optimization"
      });
      totalSavingsMonthly += savings;
      copilotTool.planId = "individual";
      copilotTool.monthlySpend = indivCost;
    }
  }

  // Rule 5: Redundant Coding Assistants (Cursor + Copilot)
  if (cursorTool && copilotTool) {
    const savings = copilotTool.monthlySpend > 0 ? copilotTool.monthlySpend : copilotTool.seats * 10;
    recommendations.push({
      title: "Redundant Coding Assistants",
      description: `You are paying for both Cursor and GitHub Copilot. Cursor has built-in AI autocomplete that replaces Copilot. Cancel Copilot.`,
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t.toolId !== "github-copilot");
  }

  // Rule 6: Windsurf vs Cursor overlap
  const windsurfTool = optimizedTools.find(t => t.toolId === "windsurf");
  if (windsurfTool && cursorTool) {
    const savings = windsurfTool.monthlySpend > 0 ? windsurfTool.monthlySpend : windsurfTool.seats * 20;
    recommendations.push({
      title: "Redundant IDE AI",
      description: `Windsurf and Cursor overlap 100% in functionality. Pick one and cancel the other. We recommend keeping Cursor for now.`,
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t.toolId !== "windsurf");
  }

  // Rule 7: UI Retail vs API Credits
  // If they have large number of seats on Claude or ChatGPT for coding/data, suggest API.
  const allChat = optimizedTools.filter(t => t.toolId === "chatgpt" || t.toolId === "claude");
  const totalChatSpend = allChat.reduce((sum, t) => sum + t.monthlySpend, 0);
  if (totalChatSpend >= 300 && input.primaryUseCase !== "writing") {
    const savings = Math.round(totalChatSpend * 0.4); // Assume 40% savings via API
    recommendations.push({
      title: "Switch to API Direct for Scale",
      description: `You are spending $${totalChatSpend}/mo on retail chat interfaces. By switching to direct API usage (via an open-source UI like LibreChat) or utilizing startup cloud credits, you could save ~40% and only pay for what you use.`,
      savingsMonthly: savings,
      type: "tier-optimization"
    });
    totalSavingsMonthly += savings;
    // We won't remove them from optimized tools, just reduce spend
    allChat.forEach(t => {
      t.monthlySpend = Math.round(t.monthlySpend * 0.6);
    });
  }

  const optimizedSpend = Math.max(0, currentSpend - totalSavingsMonthly);
  const savingsPercentage = currentSpend > 0 ? Math.round((totalSavingsMonthly / currentSpend) * 100) : 0;

  return {
    currentEstimatedSpend: currentSpend,
    optimizedSpend,
    totalSavingsMonthly,
    totalSavingsAnnual: totalSavingsMonthly * 12,
    savingsPercentage,
    recommendations,
    optimizedTools,
  };
}
