import { NextResponse } from "next/server";
import { generateAuditReport } from "../../../lib/pricing";

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
