import { 
  Box, 
  ShieldCheck, 
  Zap, 
  CircleDollarSign, 
  Users, 
  ClipboardList, 
  Settings, 
  CheckCircle2, 
  ArrowRight,
  Target
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Box size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight">AI Spend Optimizer</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          <Link href="#blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        </div>
        
        <Link href="/audit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Analyze My Stack
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-16 pb-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <Target size={16} />
            <span>Save Money, Work Smarter.</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Stop Overpaying <br />
            for <span className="text-blue-600">AI Tools</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md">
            Audit your team's AI stack in 60 seconds and get personalized recommendations to save money and boost productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/audit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              Analyze My Stack <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4 ml-2">No credit card required</p>
        </div>
        
        {/* Hero Right Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-green-50 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative border border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Your Potential Savings</h3>
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-green-500">$42</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
                <p className="text-sm text-slate-400 font-medium mt-1">Total Potential Savings</p>
              </div>
              <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                34%
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="h-48 relative flex items-end justify-around pb-6 pt-4">
              {/* Dotted curve connecting the two */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M 120 100 Q 200 40 280 120" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                <polygon points="280,120 275,110 285,115" fill="#22c55e" className="opacity-40" />
              </svg>

              {/* Current Spend Bar */}
              <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                <span className="text-sm font-bold text-slate-700">$124</span>
                <div className="w-full bg-slate-100 rounded-t-xl h-32 border border-slate-200"></div>
                <span className="text-xs font-medium text-slate-500">Current Spend</span>
              </div>
              
              {/* Optimized Spend Bar */}
              <div className="flex flex-col items-center gap-3 relative z-10 w-24">
                <span className="text-sm font-bold text-green-600">$82</span>
                <div className="w-full bg-green-500 rounded-t-xl h-20 shadow-lg shadow-green-200"></div>
                <span className="text-xs font-medium text-slate-500">Optimized Spend</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="px-8 py-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">100% Secure</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Your data is encrypted and never stored</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">No Signup Required</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Get results instantly no registration needed</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
              <CircleDollarSign size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Save Money</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Average users save $30-$200/month</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Trusted by Founders</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Startups, agencies, developers & more</p>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="px-8 py-10 border-b border-slate-100">
        <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-wider">Loved by teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold tracking-tighter">stripe</div>
          <div className="flex items-center gap-1"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-black"></div><span className="text-2xl font-bold tracking-tight">Vercel</span></div>
          <div className="flex items-center gap-2"><div className="w-7 h-7 border-[2px] border-black rounded-md flex items-center justify-center font-bold text-sm">N</div><span className="text-2xl font-bold">Notion</span></div>
          <div className="text-2xl font-bold flex items-center gap-1"><span className="text-orange-500">_</span>zapier</div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-8 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting dashed line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-slate-200 -z-10"></div>
          
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-50 relative">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-white">
              <ClipboardList size={40} />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Add Your Tools</h3>
            <p className="text-slate-500 leading-relaxed">
              Tell us which AI tools you're using and how much you spend
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-50 relative">
            <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-white">
              <Settings size={40} />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Get AI Audit</h3>
            <p className="text-slate-500 leading-relaxed">
              We analyze your stack and find savings opportunities
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-50 relative">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-white">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Save Money</h3>
            <p className="text-slate-500 leading-relaxed">
              Get personalized recommendations and start saving
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 pb-24 max-w-4xl mx-auto">
        <div className="bg-slate-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to optimize your AI stack?</h2>
            <p className="text-slate-500">Join thousands of founders and teams saving money every month.</p>
          </div>
          <Link href="/audit" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 w-full md:w-auto">
            Analyze My Stack <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
