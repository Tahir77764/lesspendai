"use client";

import { useState } from "react";
import { 
  Check, 
  Plus, 
  User, 
  DollarSign, 
  Lock, 
  ArrowRight,
  Code2,
  PenTool,
  Search,
  Grid,
  Bot,
  Sparkles,
  Terminal,
  Code,
  Globe,
  Box
} from "lucide-react";
import Link from "next/link";

type Tool = {
  id: string;
  name: string;
  price: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isCustom?: boolean;
};

const TOOLS: Tool[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    price: "$20 / month",
    icon: <Bot size={24} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  },
  {
    id: "chatgpt-team",
    name: "ChatGPT Team",
    price: "$25 / user / month",
    icon: <Bot size={24} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-800"
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    price: "$20 / month",
    icon: <Sparkles size={24} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500"
  },
  {
    id: "claude-team",
    name: "Claude Team",
    price: "$25 / user / month",
    icon: <Sparkles size={24} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    id: "cursor",
    name: "Cursor",
    price: "$20 / user / month",
    icon: <Terminal size={24} />,
    iconBg: "bg-slate-800",
    iconColor: "text-white"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    price: "$19 / user / month",
    icon: <Code size={24} />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-800"
  },
  {
    id: "gemini-advanced",
    name: "Gemini Advanced",
    price: "$19.99 / month",
    icon: <Sparkles size={24} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500"
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    price: "$20 / month",
    icon: <Globe size={24} />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-800"
  },
  {
    id: "other",
    name: "Other Tool",
    price: "Add custom tool",
    icon: <Plus size={24} />,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
    isCustom: true
  }
];

const USE_CASES = [
  { id: "coding", label: "Coding", icon: <Code2 size={16} /> },
  { id: "writing", label: "Writing", icon: <PenTool size={16} /> },
  { id: "research", label: "Research", icon: <Search size={16} /> },
  { id: "mixed", label: "Mixed / Other", icon: <Grid size={16} /> }
];

export default function AuditForm() {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [teamSize, setTeamSize] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const toggleTool = (id: string) => {
    const next = new Set(selectedTools);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedTools(next);
  };

  const isStep2 = step === 2;

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-900 font-sans pb-24">
      {/* Header */}
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

      <main className="max-w-3xl mx-auto px-6 pt-12">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12 text-sm font-medium">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</div>
            <span>Add Tools</span>
          </div>
          <div className={`w-8 h-px transition-colors ${isStep2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center gap-2 transition-colors ${isStep2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${isStep2 ? 'bg-blue-600 text-white border border-blue-600' : 'border border-slate-200'}`}>2</div>
            <span>Your Details</span>
          </div>
          <div className="w-8 h-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-xs">3</div>
            <span>Results</span>
          </div>
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Add Your AI Tools</h1>
          <p className="text-slate-500">Select the AI tools your team is currently using and your monthly spend.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
          
          {/* Tools Grid */}
          {step === 1 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-6">Select Your AI Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {TOOLS.map((tool) => {
                  const isSelected = selectedTools.has(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative text-left flex flex-col p-5 rounded-2xl border transition-all duration-200
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50/10 shadow-sm ring-1 ring-blue-500' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                    >
                      {/* Checkbox */}
                      <div className={`absolute top-4 right-4 w-5 h-5 rounded flex items-center justify-center border transition-colors
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.iconBg} ${tool.iconColor}`}>
                        {tool.icon}
                      </div>
                      
                      <h3 className="font-bold text-slate-800 mb-1">{tool.name}</h3>
                      <p className={`text-xs ${tool.isCustom ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tool.price}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Team & Usage */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold mb-6">Your Team & Usage</h2>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Team Size</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="5"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Number of people using these tools</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Monthly Spend (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <DollarSign size={18} />
                  </div>
                  <input 
                    type="number"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="124"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Your total monthly spend on AI tools</p>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-800 mb-3">Primary Use Case</label>
              <div className="flex flex-wrap gap-3">
                {USE_CASES.map((useCase) => {
                  const isSelected = primaryUseCase === useCase.id;
                  return (
                    <button
                      key={useCase.id}
                      onClick={() => setPrimaryUseCase(useCase.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border
                        ${isSelected 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {isSelected ? <Check size={16} className="text-blue-600" /> : <span className="text-slate-400">{useCase.icon}</span>}
                      {useCase.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <Link 
                href={{
                  pathname: "/audit/results",
                  query: {
                    tools: Array.from(selectedTools).join(","),
                    teamSize,
                    monthlySpend,
                    useCase: primaryUseCase
                  }
                }}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-base font-semibold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                Generate Audit Report <ArrowRight size={18} />
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mt-6 text-xs text-slate-500">
                <Lock size={12} />
                <span>Your data is secure and never stored</span>
              </div>
            </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
