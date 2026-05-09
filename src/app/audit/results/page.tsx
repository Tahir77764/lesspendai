import { generateAuditReport, ToolId } from "../../../lib/pricing";
import { redirect } from "next/navigation";
import ResultsClient from "./ResultsClient";

const GEMINI_API_KEY = "AIzaSyDrDjYpgA3q9r-LRBvjolYs4JOCjgm-D3s";

export default async function ResultsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const toolsParam = searchParams.tools;
  if (!toolsParam) {
    redirect("/audit");
  }

  const toolsList = (typeof toolsParam === "string" ? toolsParam.split(",") : toolsParam) as ToolId[];
  const teamSize = parseInt(searchParams.teamSize as string || "1", 10);
  const monthlySpend = parseInt(searchParams.monthlySpend as string || "0", 10);
  const useCase = searchParams.useCase as string || "coding";

  const report = await generateAuditReport({
    tools: toolsList,
    teamSize,
    monthlySpend,
    primaryUseCase: useCase
  });

  let aiSummary = "Your stack analysis is complete. Review the actionable recommendations below to start saving and optimizing your team's workflow.";
  try {
    const prompt = `You are an elite AI spend optimization expert talking directly to a client. 
The user has an AI stack of: ${toolsList.join(", ")} for a team of ${teamSize}. 
They reported spending $${monthlySpend}/mo, but their core stack costs $${report.currentEstimatedSpend}/mo. 
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

  return (
    <ResultsClient 
      report={report} 
      aiSummary={aiSummary} 
      toolsList={toolsList} 
      teamSize={teamSize} 
      monthlySpend={monthlySpend} 
    />
  );
}
