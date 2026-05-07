import { generateAuditReport, ToolId, TOOL_PRICING } from "../../../lib/pricing";
import { ArrowLeft, Target, ShieldCheck, Zap, AlertTriangle, Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Sparkles } from "lucide-react"; // Note: Added Sparkles import here for the AI summary section

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

  const report = generateAuditReport({
    tools: toolsList,
    teamSize,
    monthlySpend,
    primaryUseCase: useCase
  });

  let aiSummary = "Your stack analysis is complete. Review the recommendations below to start saving.";
  try {
    const prompt = `You are an AI spend optimization expert. The user has an AI stack of: ${toolsList.join(", ")} for a team of ${teamSize}. They currently spend $${report.currentEstimatedSpend}/mo. We found $${report.totalSavingsMonthly}/mo in savings. Recommendations: ${report.recommendations.map(r => r.title).join(", ")}. Write a short, encouraging 2-3 sentence executive summary for their report.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      // Optional: don't cache this so it re-generates or keep it cached
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiSummary = data.candidates[0].content.parts[0].text.replace(/\*/g, ''); // remove markdown bolding for clean UI
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
  }

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-900 font-sans pb-24">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Target size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">AI Spend Optimizer</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-center gap-4 mb-12 text-sm font-medium">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-xs">1</div>
            <span className="hidden sm:inline">Add Tools</span>
          </div>
          <div className="w-8 h-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-xs">2</div>
            <span className="hidden sm:inline">Your Details</span>
          </div>
          <div className="w-8 h-px bg-blue-600"></div>
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</div>
            <span>Results</span>
          </div>
        </div>

        <div className="mb-10 flex items-center gap-4">
          <Link href="/audit" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Your AI Audit Report</h1>
            <p className="text-slate-500">Based on a team of {teamSize} and a reported spend of ${monthlySpend}/mo.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <span className="text-slate-500 font-medium mb-2">Current Estimated Spend</span>
            <span className="text-4xl font-bold text-slate-800">${report.currentEstimatedSpend}</span>
            <span className="text-sm text-slate-400 mt-1">/ month</span>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <span className="text-slate-500 font-medium mb-2">Optimized Spend</span>
            <span className="text-4xl font-bold text-green-600">${report.optimizedSpend}</span>
            <span className="text-sm text-slate-400 mt-1">/ month</span>
          </div>
          <div className="bg-blue-600 rounded-3xl p-6 shadow-sm shadow-blue-200 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-blue-500 opacity-30">
              <Zap size={100} />
            </div>
            <span className="text-blue-100 font-medium mb-2 relative z-10">Total Potential Savings</span>
            <span className="text-4xl font-bold relative z-10">${report.totalSavingsMonthly}</span>
            <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold relative z-10">
              {report.savingsPercentage}% Reduction
            </div>
          </div>
        </div>

        {/* Stack Comparison Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-xl font-bold mb-6">Stack Comparison</h2>
          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* Current Stack */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                Your Current Stack
              </h3>
              <ul className="space-y-3 mb-4">
                {toolsList.map(t => {
                  const pricing = TOOL_PRICING[t];
                  if (!pricing) return null;
                  const isKept = report.optimizedTools.includes(t);
                  return (
                    <li key={t} className="flex justify-between items-center text-sm">
                      <span className={`flex items-center gap-2 ${isKept ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                        {!isKept ? <X size={14} className="text-red-400" /> : <div className="w-3.5" />}
                        {pricing.name}
                      </span>
                      <span className={`font-medium ${isKept ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                        ${pricing.perUser ? pricing.basePrice * Math.max(pricing.minSeats || 1, teamSize) : pricing.basePrice}/mo
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Perfect AI Tool Stack */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 relative">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 md:top-1/2 md:-left-4 md:-translate-y-1/2 md:translate-x-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-sm transform rotate-90 md:rotate-0">
                <ArrowRight size={16} />
              </div>
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Target size={16} /> The Perfect Stack
              </h3>
              <ul className="space-y-3 mb-4">
                {report.optimizedTools.map(t => {
                  const pricing = TOOL_PRICING[t];
                  if (!pricing) return null;
                  return (
                    <li key={t} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-blue-700 font-medium">
                        <Check size={14} className="text-blue-500" />
                        {pricing.name}
                      </span>
                      <span className="font-semibold text-blue-800">
                        ${pricing.perUser ? pricing.basePrice * Math.max(pricing.minSeats || 1, teamSize) : pricing.basePrice}/mo
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-sm border border-indigo-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Sparkles size={120} />
          </div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-900">
            <Sparkles className="text-indigo-500" size={24} /> AI Executive Summary
          </h2>
          <p className="text-indigo-800 leading-relaxed max-w-2xl relative z-10 text-lg">
            {aiSummary}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-green-500" /> Recommendations
          </h2>
          
          {report.recommendations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Your stack looks highly optimized!</h3>
              <p className="text-slate-500 max-w-sm mx-auto">We didn't find any obvious overlapping subscriptions or seat traps in your current selection.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-amber-100 bg-amber-50/50">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertTriangle size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800">{rec.title}</h3>
                      <span className="font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full text-sm">
                        Save ${rec.savingsMonthly}/mo
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
