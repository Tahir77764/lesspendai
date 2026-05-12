import { NextResponse } from "next/server";
import { generateAuditReport } from "../../../lib/pricing";
import pricingData from "../../../data/pricingData.json";
import { AI_TOOLS } from "../../../lib/types";

const GEMINI_API_KEY = "AIzaSyDrDjYpgA3q9r-LRBvjolYs4JOCjgm-D3s";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tools, teamSize, primaryUseCase } = body;

    const report = generateAuditReport({
      tools,
      teamSize,
      primaryUseCase
    });

    // --- Dynamic Feature Comparison with Gemini ---
    const normalizeId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    for (const currentTool of [...report.optimizedTools]) {
      const category = pricingData.categories.find(c => c.tools.some(t => {
        const aiT = AI_TOOLS.find(at => at.name === t.vendor);
        return (aiT ? aiT.id : normalizeId(t.vendor)) === currentTool.toolId;
      }));
      if (!category) continue;

      const currentToolDef = category.tools.find(t => {
        const aiT = AI_TOOLS.find(at => at.name === t.vendor);
        return (aiT ? aiT.id : normalizeId(t.vendor)) === currentTool.toolId;
      });
      if (!currentToolDef) continue;

      const currentPlanDef = currentToolDef.plans.find(p => {
        const aiT = AI_TOOLS.find(at => at.name === currentToolDef.vendor);
        const aiP = aiT?.plans.find(ap => ap.name === p.name);
        return (aiP ? aiP.id : normalizeId(p.name)) === currentTool.planId;
      });

      const currentFeatures = currentPlanDef ? currentPlanDef.features.join(", ") : "Basic AI features";
      const currentPrice = currentTool.monthlySpend;

      // Find alternatives in the same category
      const alternatives: any[] = [];
      for (const t of category.tools) {
        const altAiT = AI_TOOLS.find(at => at.name === t.vendor);
        const altToolId = altAiT ? altAiT.id : normalizeId(t.vendor);
        
        if (altToolId === currentTool.toolId) continue; // skip same tool

        for (const p of t.plans) {
          if (p.monthlyPrice !== null) {
            const planPrice = p.monthlyPrice * (p.perUser ? currentTool.seats : 1);
            if (planPrice <= currentPrice) {
              const altAiP = altAiT?.plans.find(ap => ap.name === p.name);
              alternatives.push({
                toolId: altToolId,
                toolName: t.vendor,
                planId: altAiP ? altAiP.id : normalizeId(p.name),
                planName: p.name,
                price: planPrice,
                features: p.features.join(", ")
              });
            }
          }
        }
      }

      if (alternatives.length > 0) {
        const altDesc = alternatives.map((a, i) => `[ID: ${i}] ${a.toolName} ${a.planName} (Features: ${a.features})`).join("\n");
        const prompt = `Compare the features of the current AI tool to the provided alternatives.
Current Tool: ${currentToolDef.vendor} ${currentPlanDef?.name}
Current Features: ${currentFeatures}

Alternatives:
${altDesc}

Task: Which of the alternatives have features that are EQUAL TO or BETTER THAN the Current Tool's features?
Consider the typical capabilities associated with these features.
ONLY compare features, ignore pricing.
Return a valid JSON array of the integer IDs of the alternatives that are equal or better.
For example, if ID 0 and ID 2 are better/equal, return [0, 2]. If none, return [].
IMPORTANT: Output ONLY the raw JSON array. No text, no markdown.`;

        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          });
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            let text = data.candidates[0].content.parts[0].text.trim();
            text = text.replace(/```json/g, "").replace(/```/g, "");
            try {
              const indices = JSON.parse(text);
              if (Array.isArray(indices) && indices.length > 0) {
                const validAlts = indices.map((i: number) => alternatives[i]).filter(Boolean);
                if (validAlts.length > 0) {
                  // Sort by cheapest first
                  validAlts.sort((a, b) => a.price - b.price);
                  const bestAlt = validAlts[0];
                  const savings = currentPrice - bestAlt.price;
                  
                  // Only push recommendation if there's an actual swap
                  report.recommendations.push({
                    title: `AI Feature Match: Switch to ${bestAlt.toolName} ${bestAlt.planName}`,
                    description: `Gemini AI analysis confirms that ${bestAlt.toolName} ${bestAlt.planName} has equivalent or better features than your current setup. Switching saves you $${savings}/mo.`,
                    savingsMonthly: savings,
                    type: "feature-upgrade"
                  });
                  
                  if (savings > 0) {
                    report.totalSavingsMonthly += savings;
                    report.totalSavingsAnnual += (savings * 12);
                    report.optimizedSpend -= savings;
                  }

                  const idx = report.optimizedTools.findIndex(t => t.toolId === currentTool.toolId);
                  if (idx !== -1) {
                    report.optimizedTools[idx] = {
                      toolId: bestAlt.toolId,
                      planId: bestAlt.planId,
                      seats: currentTool.seats,
                      monthlySpend: bestAlt.price
                    };
                  }
                }
              }
            } catch(e) { }
          }
        } catch (e) {
          console.error("Gemini feature comparison error", e);
        }
      }
    }

    // Recalculate percentage after dynamic swaps
    report.savingsPercentage = report.currentEstimatedSpend > 0 ? Math.round((report.totalSavingsMonthly / report.currentEstimatedSpend) * 100) : 0;
    // --- End Dynamic Feature Comparison ---

    let aiSummary = "Your stack analysis is complete. Review the actionable recommendations below to start saving and optimizing your team's workflow.";
    
    try {
      const toolNames = tools.map((t: any) => t.toolId).join(", ");
      const prompt = `You are an elite AI spend optimization expert talking directly to a client. 
The user has an AI stack of: ${toolNames} for a team of ${teamSize}. 
Their core stack costs $${report.currentEstimatedSpend}/mo. 
We found $${report.totalSavingsMonthly}/mo in potential savings. 
Recommendations: ${report.recommendations.map(r => r.title).join(", ")}. 
Write a highly professional, short, encouraging 2-3 sentence executive summary for their report. 
Do not use markdown formatting like bolding (*).`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiSummary = data.candidates[0].content.parts[0].text.replace(/\*/g, ''); 
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
    }

    return NextResponse.json({ report, aiSummary });
  } catch (error) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
