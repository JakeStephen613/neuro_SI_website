import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background: Subtle Dot Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <header className="mb-16 animate-fade-in-up text-center lg:text-left">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-mono font-medium tracking-widest text-blue-800 uppercase bg-blue-50 rounded-full border border-blue-100">
            NeuroSI Benchmark v2.1
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 mb-6">
            Evaluating <span className="text-blue-700 italic">Reasoning</span> <br />
            Against Human Baselines.
          </h1>
          
          {/* Stats Ticker */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm font-mono text-slate-500 border-y border-slate-200 py-4 mt-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              5 DIFFICULTY LEVELS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              32B PARAMETERS (QWEN)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              100+ GROUND TRUTH PATHS
            </span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Research Content */}
          <div className="lg:col-span-8 space-y-12 animate-fade-in-up [animation-delay:200ms]">
            
            {/* Abstract Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">01. Abstract</h2>
                <div className="h-px bg-slate-200 flex-grow"></div>
              </div>
              <p className="font-serif text-lg leading-loose text-slate-700">
                Large Language Models (LLMs) often exhibit "hallucinations" when reasoning through complex, multi-hop queries. 
                This benchmark isolates reasoning capabilities by comparing model performance against expert human logic 
                across varying degrees of complexity ($k$-hops).
              </p>
            </section>

            {/* Methodology Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">02. Methodology</h2>
                <div className="h-px bg-slate-200 flex-grow"></div>
              </div>
              <div className="prose prose-slate prose-lg text-slate-600">
                <p className="mb-4">
                  Participants are presented with 10 randomly selected scenarios. Each scenario requires logical deduction 
                  derived strictly from the provided context.
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                  <li><strong>Data Layer:</strong> Synthesized logic puzzles with unambiguous ground truths.</li>
                  <li><strong>Model Comparison:</strong> Your answers are compared in real-time against Qwen-2.5-32B.</li>
                  <li><strong>Scoring:</strong> Correctness is binary; reasoning trace is available for audit.</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24">
              <div className="glass-panel p-8 rounded-2xl animate-fade-in-up [animation-delay:400ms] bg-white border border-slate-200 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Begin Session</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Ready to test your reasoning against the state-of-the-art?
                </p>
                
                {/* --- THIS IS THE FIX --- */}
                <Link 
                  href="/quiz"
                  className="group flex items-center justify-center w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Start Benchmark
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                {/* ----------------------- */}

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400 font-mono">
                    SESSION ID: <span className="text-slate-600">NULL</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}