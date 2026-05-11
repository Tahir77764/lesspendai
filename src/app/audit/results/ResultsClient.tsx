"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Target, ShieldCheck, Zap, AlertTriangle, Check, X, ArrowRight, Sparkles, Mail, User, Building } from "lucide-react";
import Link from "next/link";
import { AuditReport } from "../../../lib/pricing";
import { AI_TOOLS } from "../../../lib/types";

export default function ResultsClient() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [teamSize, setTeamSize] = useState(1);
  const [originalTools, setOriginalTools] = useState<any[]>([]);

  // Lead capture state
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const inputStr = localStorage.getItem("auditInput");
    if (!inputStr) {
      window.location.href = "/audit";
      return;
    }
    
    try {
      const input = JSON.parse(inputStr);
      setTeamSize(input.teamSize);
      setOriginalTools(input.tools);
      
      fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      .then(res => res.json())
      .then(data => {
        setReport(data.report);
        setAiSummary(data.aiSummary);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    } catch (e) {
      console.error(e);
      window.location.href = "/audit";
    }
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, report })
      });
      if (res.ok) {
        setLeadStatus("success");
      } else {
        setLeadStatus("error");
      }
    } catch (error) {
      setLeadStatus("error");
    }
  };

  const getToolName = (toolId: string, planId: string) => {
    const t = AI_TOOLS.find(x => x.id === toolId);
    if (!t) return "Unknown Tool";
    const p = t.plans.find(x => x.id === planId);
    return `${t.name} ${p ? p.name : ""}`;
  };

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <Target size={48} className="text-blue-500 mb-4 animate-spin-slow" />
          <h2 className="text-xl font-bold">Analyzing your AI stack...</h2>
        </div>
      </div>
    );
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 300, damping: 24 } }
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center gap-4">
          <Link href="/audit" className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-slate-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Your AI Audit Report</h1>
            <p className="text-slate-400">Team of {teamSize}</p>
          </div>
        </motion.div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVars} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <span className="text-slate-400 font-medium mb-2 relative z-10">Current Spend</span>
            <span className="text-4xl font-bold text-white relative z-10">${report.currentEstimatedSpend}</span>
            <span className="text-sm text-slate-500 mt-1 relative z-10">/ month</span>
          </motion.div>
          
          <motion.div variants={itemVars} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <span className="text-slate-400 font-medium mb-2 relative z-10">Optimized Spend</span>
            <span className="text-4xl font-bold text-emerald-400 relative z-10">${report.optimizedSpend}</span>
            <span className="text-sm text-slate-500 mt-1 relative z-10">/ month</span>
          </motion.div>

          <motion.div variants={itemVars} className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-6 shadow-2xl shadow-blue-900/50 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-white/20 animate-pulse"><Zap size={100} /></div>
            <span className="text-blue-100 font-medium mb-2 relative z-10">Potential Savings</span>
            <span className="text-5xl font-extrabold relative z-10 tracking-tight">${report.totalSavingsMonthly} <span className="text-xl text-blue-200 font-medium">/mo</span></span>
            <div className="mt-3 flex flex-col items-center gap-2 relative z-10">
              <span className="text-blue-200 text-sm font-medium border-b border-blue-400/30 pb-1">${report.totalSavingsAnnual} / year</span>
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                {report.savingsPercentage}% Reduction
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">Stack Comparison</h2>
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
              <h3 className="font-semibold text-slate-300 mb-6 flex items-center gap-2">Your Current Stack</h3>
              <ul className="space-y-4">
                {originalTools.map((t, i) => {
                  const isKept = report.optimizedTools.some(opt => opt.toolId === t.toolId);
                  return (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className={`flex items-center gap-3 ${isKept ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                        {!isKept ? <X size={16} className="text-red-400/70" /> : <div className="w-4" />}
                        {getToolName(t.toolId, t.planId)} ({t.seats} seats)
                      </span>
                      <span className={`font-medium ${isKept ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                        ${t.monthlySpend}/mo
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 md:top-1/2 md:-left-4 md:-translate-y-1/2 md:translate-x-0 w-8 h-8 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-xl transform rotate-90 md:rotate-0">
                <ArrowRight size={16} />
              </div>
              <h3 className="font-semibold text-blue-400 mb-6 flex items-center gap-2 relative z-10">
                <Target size={18} /> The Perfect Stack
              </h3>
              <ul className="space-y-4 relative z-10">
                {report.optimizedTools.map((t, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-3 text-blue-100 font-medium">
                      <Check size={16} className="text-emerald-400" />
                      {getToolName(t.toolId, t.planId)}
                    </span>
                    <span className="font-semibold text-blue-200 bg-blue-500/10 px-2 py-0.5 rounded">
                      ${t.monthlySpend}/mo
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 rounded-3xl p-8 border border-violet-500/20 mb-8 relative overflow-hidden backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fuchsia-300 relative z-10">
            <Sparkles className="text-fuchsia-400" size={24} /> AI Executive Summary
          </h2>
          <p className="text-fuchsia-100/90 leading-relaxed max-w-3xl relative z-10 text-lg font-medium">
            {aiSummary}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <ShieldCheck className="text-emerald-400" size={28} /> Actionable Recommendations
          </h2>
          {report.recommendations.length === 0 ? (
            <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} /></div>
              <h3 className="text-2xl font-bold text-white mb-3">Your stack is perfectly optimized!</h3>
            </div>
          ) : (
            <div className="grid gap-4">
              {report.recommendations.map((rec, i) => {
                const isUpgrade = rec.type === "feature-upgrade";
                return (
                  <div key={i} className={`flex gap-5 p-6 rounded-2xl border transition-colors ${isUpgrade ? 'border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent hover:bg-blue-500/10' : 'border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent hover:bg-amber-500/10'}`}>
                    <div className="shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUpgrade ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {isUpgrade ? <Sparkles size={20} /> : <AlertTriangle size={20} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                        {rec.savingsMonthly > 0 ? (
                          <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-sm">Save ${rec.savingsMonthly}/mo</span>
                        ) : (
                          <span className="font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-sm">Better Features</span>
                        )}
                      </div>
                      <p className="text-base text-slate-300 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Gated Capture Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="max-w-2xl mx-auto bg-gradient-to-b from-blue-900/40 to-black/40 rounded-3xl p-8 border border-blue-500/20 text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Save & Share Your Report</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Get a permanent link to this report and {report.totalSavingsMonthly > 500 ? "book a free consultation with Credex to implement these savings." : "get notified when new AI pricing drops."}
          </p>
          
          {leadStatus === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400 flex flex-col items-center">
              <Check size={48} className="mb-4" />
              <h3 className="text-xl font-bold mb-2">Report saved!</h3>
              <p>Check your email for the permanent link.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Work Email" className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Building size={18} /></div>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company (Optional)" className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role (Optional)" className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white" />
                </div>
              </div>
              
              {/* Honeypot field for basic abuse protection */}
              <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />
              
              <button disabled={leadStatus === "submitting"} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                {leadStatus === "submitting" ? "Saving..." : "Email My Report & Get Link"}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
