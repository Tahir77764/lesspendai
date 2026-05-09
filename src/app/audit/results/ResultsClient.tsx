"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, ShieldCheck, Zap, AlertTriangle, Check, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { ToolId, AuditReport } from "../../../lib/pricing";

export default function ResultsClient({
  report,
  aiSummary,
  toolsList,
  teamSize,
  monthlySpend
}: {
  report: AuditReport;
  aiSummary: string;
  toolsList: ToolId[];
  teamSize: number;
  monthlySpend: number;
}) {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans pb-24 selection:bg-blue-500/30">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 text-white p-1.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Target size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Less Spend AI</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 flex items-center gap-4"
        >
          <Link href="/audit" className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-slate-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Your AI Audit Report</h1>
            <p className="text-slate-400">Team of {teamSize} • Reported Spend: <span className="text-slate-300 font-medium">${monthlySpend}/mo</span></p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVars} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-slate-400 font-medium mb-2 relative z-10">Current Spend</span>
            <span className="text-4xl font-bold text-white relative z-10">${report.currentEstimatedSpend}</span>
            <span className="text-sm text-slate-500 mt-1 relative z-10">/ month</span>
          </motion.div>
          
          <motion.div variants={itemVars} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-slate-400 font-medium mb-2 relative z-10">Optimized Spend</span>
            <span className="text-4xl font-bold text-emerald-400 relative z-10">${report.optimizedSpend}</span>
            <span className="text-sm text-slate-500 mt-1 relative z-10">/ month</span>
          </motion.div>

          <motion.div variants={itemVars} className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-6 shadow-2xl shadow-blue-900/50 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-white/20 animate-pulse">
              <Zap size={100} />
            </div>
            <span className="text-blue-100 font-medium mb-2 relative z-10">Potential Savings</span>
            <span className="text-5xl font-extrabold relative z-10 tracking-tight">${report.totalSavingsMonthly}</span>
            <div className="mt-3 inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold relative z-10">
              {report.savingsPercentage}% Reduction
            </div>
          </motion.div>
        </motion.div>

        {/* Stack Comparison Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-8"
        >
          <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
             Stack Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* Current Stack */}
            <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
              <h3 className="font-semibold text-slate-300 mb-6 flex items-center gap-2">
                Your Current Stack
              </h3>
              <ul className="space-y-4">
                {toolsList.map(t => {
                  const pricing = report.pricingMap[t];
                  if (!pricing) return null;
                  const isKept = report.optimizedTools.includes(t);
                  return (
                    <li key={t} className="flex justify-between items-center text-sm group">
                      <span className={`flex items-center gap-3 ${isKept ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                        {!isKept ? <X size={16} className="text-red-400/70" /> : <div className="w-4" />}
                        {pricing.name}
                      </span>
                      <span className={`font-medium ${isKept ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                        ${pricing.perUser ? pricing.basePrice * Math.max(pricing.minSeats || 1, teamSize) : pricing.basePrice}/mo
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Perfect AI Tool Stack */}
            <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 md:top-1/2 md:-left-4 md:-translate-y-1/2 md:translate-x-0 w-8 h-8 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-xl transform rotate-90 md:rotate-0">
                <ArrowRight size={16} />
              </div>
              <h3 className="font-semibold text-blue-400 mb-6 flex items-center gap-2 relative z-10">
                <Target size={18} /> The Perfect Stack
              </h3>
              <ul className="space-y-4 relative z-10">
                {report.optimizedTools.map(t => {
                  const pricing = report.pricingMap[t];
                  if (!pricing) return null;
                  return (
                    <li key={t} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-3 text-blue-100 font-medium">
                        <Check size={16} className="text-emerald-400" />
                        {pricing.name}
                      </span>
                      <span className="font-semibold text-blue-200 bg-blue-500/10 px-2 py-0.5 rounded">
                        ${pricing.perUser ? pricing.basePrice * Math.max(pricing.minSeats || 1, teamSize) : pricing.basePrice}/mo
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 rounded-3xl p-8 border border-violet-500/20 mb-8 relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute -top-10 -right-10 text-fuchsia-500/10 rotate-12 blur-sm">
             <Sparkles size={200} />
          </div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fuchsia-300 relative z-10">
            <Sparkles className="text-fuchsia-400" size={24} /> AI Executive Summary
          </h2>
          <p className="text-fuchsia-100/90 leading-relaxed max-w-3xl relative z-10 text-lg font-medium">
            {aiSummary}
          </p>
        </motion.div>

        {/* Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <ShieldCheck className="text-emerald-400" size={28} /> Actionable Recommendations
          </h2>
          
          {report.recommendations.length === 0 ? (
            <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Your stack is perfectly optimized!</h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg">We didn't find any obvious overlapping subscriptions or seat traps in your current selection. Great job!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {report.recommendations.map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (i * 0.1) }}
                  key={i} 
                  className="flex gap-5 p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent hover:bg-amber-500/10 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                      <AlertTriangle size={20} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-sm shadow-sm">
                        Save ${rec.savingsMonthly}/mo
                      </span>
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed">{rec.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
