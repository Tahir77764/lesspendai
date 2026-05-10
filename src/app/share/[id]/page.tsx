import { Metadata } from 'next';
import { Target, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  let savings = 0;
  let percentage = 0;
  
  try {
    const decoded = JSON.parse(Buffer.from(resolvedParams.id, 'base64').toString('utf-8'));
    savings = decoded.s;
    percentage = decoded.p;
  } catch (e) {
    // default values if parsing fails
  }

  const title = `AI Stack Audit: Saving $${savings}/mo (${percentage}%)`;
  const description = `We analyzed this team's AI stack and found $${savings} in monthly savings by eliminating redundant tools and optimizing seat counts. See how much you could save.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Less Spend AI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function SharePage({ params }: Props) {
  const resolvedParams = await params;
  let data = { s: 0, c: 0, o: 0, p: 0, t: [] as string[] };
  let valid = false;

  try {
    data = JSON.parse(Buffer.from(resolvedParams.id, 'base64').toString('utf-8'));
    valid = true;
  } catch (e) {
    console.error("Invalid share ID");
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Report Link</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">Run your own audit</Link>
        </div>
      </div>
    );
  }

  // Format tool names nicely
  const getToolDisplayName = (id: string) => {
    const names: Record<string, string> = {
      "cursor": "Cursor",
      "github-copilot": "GitHub Copilot",
      "claude": "Claude",
      "chatgpt": "ChatGPT",
      "gemini": "Gemini",
      "windsurf": "Windsurf",
      "anthropic-api": "Anthropic API",
      "openai-api": "OpenAI API"
    };
    return names[id] || id;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans pb-24 selection:bg-blue-500/30">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 text-white p-1.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Target size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Less Spend AI</span>
          </Link>
          <Link href="/audit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
            Audit My Stack
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
          <ShieldCheck size={16} /> Verified Anonymous Audit
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          This team is wasting <span className="text-red-400">${data.s}/mo</span> on AI subscriptions.
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          We analyzed their stack and found they could reduce their spend by {data.p}% just by eliminating redundant tools and optimizing plans.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center">
            <span className="text-slate-400 font-medium mb-2">Current Spend</span>
            <span className="text-4xl font-bold text-white">${data.c}</span>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center">
            <span className="text-slate-400 font-medium mb-2">Optimized Spend</span>
            <span className="text-4xl font-bold text-emerald-400">${data.o}</span>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-6 shadow-2xl shadow-blue-900/50 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-white/20"><Zap size={100} /></div>
            <span className="text-blue-100 font-medium mb-2 relative z-10">Potential Savings</span>
            <span className="text-5xl font-extrabold relative z-10 tracking-tight">${data.s}</span>
          </div>
        </div>

        {data.t && data.t.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-16 text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Target size={20} className="text-blue-400" /> Their Optimized Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.t.map((toolId, i) => (
                <div key={i} className="bg-blue-500/10 border border-blue-500/20 text-blue-200 px-4 py-2 rounded-xl font-medium">
                  {getToolDisplayName(toolId)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-b from-blue-900/40 to-black/40 rounded-3xl p-10 border border-blue-500/20 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Are you overpaying for AI?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">
            Stop guessing. Run a free audit on your stack in 60 seconds and find out exactly how much you can save.
          </p>
          <Link href="/audit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-500/30">
            Audit My Stack Now <Zap size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
