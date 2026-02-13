import { Atom } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Atom className="w-6 h-6 text-brand" />
          <Link href="/" className="font-serif font-bold text-xl text-brand tracking-tight">
            Neuro<span className="text-slate-500">SI</span> Research
          </Link>
        </div>
        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            {/* Pulsing outer circle */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 status-glow"></span>
            {/* Solid inner circle */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          System Operational
        </div>
      </div>
    </nav>
  );
}
