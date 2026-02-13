"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  Terminal, 
  Copy, 
  Check, 
  BrainCircuit 
} from "lucide-react";
import clsx from "clsx";
import { Question } from "@/lib/data"; 

// --- THIS INTERFACE WAS MISSING THE 'index' FIELD ---
interface ResultCardProps {
  question: Question;
  userAnswer: string;
  index: number; // <--- This is the fix
}

export default function ResultCard({ question, userAnswer, index }: ResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUserCorrect = userAnswer === question.correct_answer;
  // Fallback to false if model_correct is undefined
  const isModelCorrect = question.model_correct ?? false; 

  const handleCopyTrace = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling when clicking copy
    if (!question.explanation) return;
    navigator.clipboard.writeText(question.explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      
      {/* 1. HEADER (Always Visible) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 flex items-center justify-between group bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-5 overflow-hidden">
          {/* Status Icon */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 gap-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold">Q{index + 1}</span>
            {isUserCorrect 
              ? <CheckCircle className="w-6 h-6 text-emerald-500" /> 
              : <XCircle className="w-6 h-6 text-red-500" />
            }
          </div>

          {/* Question Preview & Meta Data */}
          <div className="min-w-0 flex-1">
            <h4 className="font-serif font-medium text-slate-900 truncate pr-4 text-base">
              {question.question}
            </h4>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs mt-1.5 font-mono">
              {/* User Result */}
              <div className={clsx("flex items-center gap-1.5 font-semibold", isUserCorrect ? "text-emerald-700" : "text-red-600")}>
                <span className="opacity-50 uppercase tracking-wider text-slate-500">You:</span>
                <span>{userAnswer}</span>
              </div>

              <span className="text-slate-300 hidden sm:inline">|</span>

              {/* Model Result */}
              <div className={clsx("flex items-center gap-1.5 font-semibold", isModelCorrect ? "text-blue-700" : "text-orange-600")}>
                <span className="opacity-50 uppercase tracking-wider text-slate-500">Model:</span>
                <span>{isModelCorrect ? "CORRECT" : "INCORRECT"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chevron Animation */}
        <div className={clsx("flex-shrink-0 ml-4 transition-transform duration-300", isOpen && "rotate-180")}>
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
        </div>
      </button>
      
      {/* 2. ACCORDION BODY */}
      <div className={clsx(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-slate-200">
            
            {/* LEFT: Context & Options (Diff View) */}
            <div className="p-6 md:p-8 bg-slate-50">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                Scenario Context
              </h5>
              <p className="text-slate-800 leading-relaxed font-serif text-sm mb-8">
                {question.question}
              </p>
              
              <div className="space-y-3">
                {question.options.map((optionText, i) => {
                  const letter = ["A", "B", "C", "D"][i];
                  const isCorrectOption = letter === question.correct_answer;
                  const isUserSelected = letter === userAnswer;
                  
                  // Determine Style State
                  let styleClass = "bg-white border-transparent text-slate-500 opacity-80"; // Default
                  
                  if (isCorrectOption) {
                    styleClass = "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm ring-1 ring-emerald-500/20";
                  } else if (isUserSelected && !isCorrectOption) {
                    styleClass = "bg-red-50 border-red-200 text-red-900 shadow-sm ring-1 ring-red-500/20";
                  }

                  return (
                    <div key={i} className={clsx("flex items-start gap-3 p-3 rounded-lg text-sm border transition-colors", styleClass)}>
                      <span className="font-bold font-mono text-xs mt-0.5">{letter}</span>
                      <span className="leading-snug">{optionText}</span>
                      {isCorrectOption && <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0 text-emerald-600" />}
                      {isUserSelected && !isCorrectOption && <XCircle className="w-4 h-4 ml-auto flex-shrink-0 text-red-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Terminal Trace Window */}
            <div className="relative flex flex-col h-full bg-[#0f172a] border-l border-slate-200 min-h-[300px]">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-slate-700">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">System Trace (CoT)</span>
                </div>
                
                <button 
                  onClick={handleCopyTrace}
                  className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "COPIED" : "COPY LOG"}
                </button>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="font-mono text-xs leading-loose text-slate-300">
                  {question.explanation ? (
                    <>
                      <span className="text-blue-400">$ reasoning_process --start</span>
                      <br />
                      <div className="whitespace-pre-wrap mt-2 pl-2 border-l border-slate-700 ml-1">
                        {question.explanation}
                      </div>
                      <br />
                      <span className="text-blue-400">$ process --exit code 0</span>
                    </>
                  ) : (
                    <span className="text-slate-600 italic">// No trace data available for this query.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}