import { AuditInput, ToolSelection, AI_TOOLS } from "./types";

export interface Recommendation {
  title: string;
  description: string;
  savingsMonthly: number;
  type: "redundancy" | "tier-optimization" | "seat-trap" | "feature-upgrade";
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

  // Check 0: General Overpayment (if user manually entered a spend higher than the official rate)
  optimizedTools.forEach(tool => {
    const def = AI_TOOLS.find(t => t.id === tool.toolId);
    const plan = def?.plans.find(p => p.id === tool.planId);
    if (def && plan) {
      const expectedCost = plan.perUser ? plan.basePrice * Math.max(tool.seats, plan.minSeats || 1) : plan.basePrice;
      if (tool.monthlySpend > expectedCost && expectedCost > 0) {
        const overpayment = tool.monthlySpend - expectedCost;
        recommendations.push({
          title: `Overpaying for ${def.name} ${plan.name}`,
          description: `You reported spending $${tool.monthlySpend}/mo on ${def.name}. The official price is $${expectedCost}/mo for your configuration. Cancel unused add-ons or fix your billing.`,
          savingsMonthly: overpayment,
          type: "tier-optimization"
        });
        totalSavingsMonthly += overpayment;
        tool.monthlySpend = expectedCost; // Normalize spend for subsequent rules
      }
    }
  });

  // Rule 1: Claude Team Seat Minimum Trap
  const claudeTool = optimizedTools.find(t => t.toolId === "claude");
  if (claudeTool && (claudeTool.planId === "team-standard" || claudeTool.planId === "team-premium") && claudeTool.seats < 5) {
    const minSeatsSpend = claudeTool.planId === "team-premium" ? 125 * 5 : 25 * 5;
    const currentCost = claudeTool.monthlySpend > 0 ? claudeTool.monthlySpend : minSeatsSpend;
    const proCost = claudeTool.seats * 17; // Pro is $17
    const savings = currentCost - proCost;
    if (savings > 0) {
      recommendations.push({
        title: "Claude Team Minimum Seat Trap",
        description: `Claude Team requires 5 seats minimum. For ${claudeTool.seats} users, downgrade to individual Claude Pro accounts to save money while retaining heavy reasoning features.`,
        savingsMonthly: savings,
        type: "seat-trap"
      });
      totalSavingsMonthly += savings;
      claudeTool.planId = "pro";
      claudeTool.monthlySpend = proCost;
    }
  }

  // Rule 2: Cursor Teams Overspend
  const cursorTool = optimizedTools.find(t => t.toolId === "cursor");
  if (cursorTool && cursorTool.planId === "teams" && cursorTool.seats <= 2) {
    const currentCost = cursorTool.monthlySpend > 0 ? cursorTool.monthlySpend : cursorTool.seats * 40;
    const proCost = cursorTool.seats * 20;
    const savings = currentCost - proCost;
    if (savings > 0) {
      recommendations.push({
        title: "Cursor Teams Overspend",
        description: `Cursor Teams ($40/user) is overkill for 1-2 users. Switch to Cursor Pro ($20/user) for the same core AI capabilities, including Cloud Agents and SWE-1.6.`,
        savingsMonthly: savings,
        type: "tier-optimization"
      });
      totalSavingsMonthly += savings;
      cursorTool.planId = "pro";
      cursorTool.monthlySpend = proCost;
    }
  }

  // Rule 3: Copilot Business for Solo Dev
  const copilotTool = optimizedTools.find(t => t.toolId === "github-copilot");
  if (copilotTool && copilotTool.planId === "business" && copilotTool.seats === 1) {
    const currentCost = copilotTool.monthlySpend > 0 ? copilotTool.monthlySpend : 19;
    const indivCost = 10;
    const savings = currentCost - indivCost;
    if (savings > 0) {
      recommendations.push({
        title: "Copilot Business for Solo Dev",
        description: `Copilot Business is meant for enterprise policy control. A solo developer should use Copilot Pro ($10/mo).`,
        savingsMonthly: savings,
        type: "tier-optimization"
      });
      totalSavingsMonthly += savings;
      copilotTool.planId = "pro";
      copilotTool.monthlySpend = indivCost;
    }
  }

  // Rule 4: Redundant Coding Assistants (Cursor + Copilot)
  if (cursorTool && copilotTool) {
    const savings = copilotTool.monthlySpend > 0 ? copilotTool.monthlySpend : copilotTool.seats * 10;
    recommendations.push({
      title: "Redundant Coding Assistants",
      description: `You are paying for both Cursor and GitHub Copilot. Cursor has built-in AI autocomplete that completely replaces Copilot. Cancel Copilot to eliminate functional redundancy.`,
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t.toolId !== "github-copilot");
  }

  // Rule 5: Windsurf vs Cursor overlap
  const windsurfTool = optimizedTools.find(t => t.toolId === "windsurf");
  if (windsurfTool && cursorTool) {
    const savings = windsurfTool.monthlySpend > 0 ? windsurfTool.monthlySpend : windsurfTool.seats * 20;
    recommendations.push({
      title: "Redundant IDE AI",
      description: `Windsurf and Cursor overlap 100% in functionality as AI-first IDEs. Pick one and cancel the other. We recommend keeping Cursor for its cloud agents and frontier model access.`,
      savingsMonthly: savings,
      type: "redundancy"
    });
    totalSavingsMonthly += savings;
    optimizedTools = optimizedTools.filter(t => t.toolId !== "windsurf");
  }

  // Rule 6: Feature Upgrade - Move from Copilot to Cursor/Windsurf
  if (copilotTool && !cursorTool && !windsurfTool && input.primaryUseCase === "coding") {
    // Check if Copilot is costing more or equal to Cursor Pro ($20)
    const copilotCost = copilotTool.monthlySpend;
    let recDesc = `GitHub Copilot is a great plugin, but AI-native IDEs like Cursor or Windsurf provide significantly better features (multi-agent workflows, built-in worktrees, codebase indexing). Switch to Cursor Pro ($20/mo) to drastically boost coding productivity.`;
    let savings = 0;
    if (copilotCost > 20) {
       savings = copilotCost - 20;
       recDesc += ` Plus, you'll save $${savings}/mo!`;
    }

    copilotTool.toolId = "cursor";
    copilotTool.planId = "pro";
    copilotTool.monthlySpend = 20;

    recommendations.push({
      title: "Upgrade to an AI-Native IDE",
      description: recDesc,
      savingsMonthly: savings,
      type: "feature-upgrade"
    });
    if (savings > 0) totalSavingsMonthly += savings;
  }

  // Rule 7: Feature Upgrade - ChatGPT vs Claude for Coding
  const chatgptTool = optimizedTools.find(t => t.toolId === "chatgpt");
  if (chatgptTool && !claudeTool && input.primaryUseCase === "coding") {
    const gptCost = chatgptTool.monthlySpend;
    let savings = 0;
    let recDesc = `You are using ChatGPT for coding. Claude Pro ($17/mo) provides access to Claude 3.5 Sonnet, which consistently benchmarks higher for software engineering, complex reasoning, and UI generation. Consider switching to Claude.`;
    
    if (gptCost > 17) {
      savings = gptCost - 17;
      recDesc += ` This switch will also save you $${savings}/mo.`;
    }

    chatgptTool.toolId = "claude";
    chatgptTool.planId = "pro";
    chatgptTool.monthlySpend = 17;

    recommendations.push({
      title: "Claude 3.5 Sonnet Outperforms GPT for Coding",
      description: recDesc,
      savingsMonthly: savings,
      type: "feature-upgrade"
    });
    if (savings > 0) totalSavingsMonthly += savings;
  }

  // Rule 8: Feature Upgrade - ChatGPT vs Gemini for Research
  const geminiTool = optimizedTools.find(t => t.toolId === "gemini");
  if (chatgptTool && !geminiTool && input.primaryUseCase === "research") {
    const gptCost = chatgptTool.monthlySpend;
    let savings = 0;
    let recDesc = `For research tasks, Gemini's Google AI Plus/Pro plans include 'Deep Research' on the 3.1 Pro model and native Google Workspace integration. This often provides more comprehensive data aggregation than standard ChatGPT.`;
    
    if (gptCost > 5) {
      savings = gptCost - 5;
      recDesc += ` Switching to Google AI Plus will save you $${savings}/mo.`;
    }

    chatgptTool.toolId = "gemini";
    chatgptTool.planId = "google-ai-plus";
    chatgptTool.monthlySpend = 5;

    recommendations.push({
      title: "Gemini is Superior for Deep Research",
      description: recDesc,
      savingsMonthly: savings,
      type: "feature-upgrade"
    });
    if (savings > 0) totalSavingsMonthly += savings;
  }

  // Ensure optimized spend isn't negative
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
