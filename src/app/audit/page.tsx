"use client";

import { useState, useEffect } from "react";
import { 
  Check, Plus, User, DollarSign, Lock, ArrowRight,
  Code2, PenTool, Search, Grid, Bot, Sparkles, Terminal, Code, Globe, Box
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AI_TOOLS, ToolDef, ToolSelection } from "../../lib/types";

const USE_CASES = [
  { id: "coding", label: "Coding", icon: <Code2 size={16} /> },
  { id: "writing", label: "Writing", icon: <PenTool size={16} /> },
  { id: "data", label: "Data", icon: <Search size={16} /> },
  { id: "research", label: "Research", icon: <Globe size={16} /> },
  { id: "mixed", label: "Mixed / Other", icon: <Grid size={16} /> }
];

export default function AuditForm() {
  const router = useRouter();
  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(new Set());
  const [toolDetails, setToolDetails] = useState<Record<string, ToolSelection>>({});
  
  const [teamSize, setTeamSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditFormState");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedToolIds) setSelectedToolIds(new Set(parsed.selectedToolIds));
        if (parsed.toolDetails) setToolDetails(parsed.toolDetails);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase);
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("auditFormState", JSON.stringify({
        selectedToolIds: Array.from(selectedToolIds),
        toolDetails,
        teamSize,
        primaryUseCase
      }));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [selectedToolIds, toolDetails, teamSize, primaryUseCase]);

  const toggleTool = (id: string) => {
    const next = new Set(selectedToolIds);
    if (next.has(id)) {
      next.delete(id);
      const nextDetails = { ...toolDetails };
      delete nextDetails[id];
      setToolDetails(nextDetails);
    } else {
      next.add(id);
      const toolDef = AI_TOOLS.find(t => t.id === id);
      if (toolDef) {
        setToolDetails(prev => ({
          ...prev,
          [id]: {
            toolId: id,
            planId: toolDef.plans[0].id,
            seats: 1,
            monthlySpend: toolDef.plans[0].basePrice || 0
          }
        }));
      }
    }
    setSelectedToolIds(next);
  };

  const updateToolDetail = (id: string, field: keyof ToolSelection, value: any) => {
    setToolDetails(prev => {
      const tool = prev[id];
      const newTool = { ...tool, [field]: value };
      
      // Auto-calculate spend if plan or seats changed
      if (field === 'planId' || field === 'seats') {
        const toolDef = AI_TOOLS.find(t => t.id === id);
        const plan = toolDef?.plans.find(p => p.id === newTool.planId);
        if (plan) {
           const calculatedSpend = plan.perUser ? plan.basePrice * Math.max(newTool.seats, plan.minSeats || 1) : plan.basePrice;
           newTool.monthlySpend = calculatedSpend;
        }
      }

      return {
        ...prev,
        [id]: newTool
      };
    });
  };

  const isStep2 = step === 2;

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedToolIds.size === 0) {
      alert("Please select at least one tool.");
      return;
    }
    const input = {
      tools: Object.values(toolDetails),
      teamSize: parseInt(teamSize) || 1,
      primaryUseCase: primaryUseCase || "mixed"
    };
    
    // Pass state via localStorage or URL. LocalStorage is safer for complex nested arrays.
    localStorage.setItem("auditInput", JSON.stringify(input));
    router.push("/audit/results");
  };

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-900 font-sans pb-24">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Box size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">AI Spend Optimizer</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-center gap-4 mb-12 text-sm font-medium">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'border border-slate-200'}`}>1</div>
            <span>Select Tools</span>
          </div>
          <div className={`w-8 h-px transition-colors ${isStep2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center gap-2 transition-colors ${isStep2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${isStep2 ? 'bg-blue-600 text-white' : 'border border-slate-200'}`}>2</div>
            <span>Tool Details</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
          
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">What AI tools are you paying for?</h1>
                <p className="text-slate-500">Select all that apply.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {AI_TOOLS.map((tool) => {
                  const isSelected = selectedToolIds.has(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50/10 shadow-sm ring-1 ring-blue-500' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                        ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                        <Bot size={24} className="text-slate-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{tool.name}</h3>
                    </button>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 gap-8 mb-8 border-t border-slate-100 pt-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Total Team Size</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input 
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                      placeholder="e.g. 5"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Primary Use Case</label>
                  <select 
                    value={primaryUseCase}
                    onChange={(e) => setPrimaryUseCase(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="" disabled>Select primary use case...</option>
                    {USE_CASES.map(uc => (
                      <option key={uc.id} value={uc.id}>{uc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => {
                    if (selectedToolIds.size === 0) {
                      alert("Please select at least one tool.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-semibold flex items-center gap-2 transition-all"
                >
                  Configure Plans <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Plan Details</h1>
                <p className="text-slate-500">Configure your current subscription for each tool.</p>
              </div>
            
              <div className="space-y-6 mb-10">
                {Array.from(selectedToolIds).map(id => {
                  const toolDef = AI_TOOLS.find(t => t.id === id);
                  const detail = toolDetails[id];
                  if (!toolDef || !detail) return null;

                  return (
                    <div key={id} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50">
                      <h3 className="font-bold text-lg mb-4">{toolDef.name}</h3>
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Plan</label>
                          <select 
                            value={detail.planId}
                            onChange={(e) => updateToolDetail(id, 'planId', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                          >
                            {toolDef.plans.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Seats / Users</label>
                          <input 
                            type="number"
                            value={detail.seats}
                            onChange={(e) => updateToolDetail(id, 'seats', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Spend ($)</label>
                          <input 
                            type="number"
                            value={detail.monthlySpend}
                            onChange={(e) => updateToolDetail(id, 'monthlySpend', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-base font-semibold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Generate Audit Report <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
