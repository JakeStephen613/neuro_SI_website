"use client";

import { useState } from 'react';
import { Question } from '@/lib/data';
import { submitQuizResult } from '@/app/actions';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowRight, Activity, User, Briefcase, BrainCircuit } from 'lucide-react';
import ResultCard from './ResultCard'; // Ensure this matches your file structure
import clsx from 'clsx';

interface QuizAppProps {
  questionsPool: Question[]; 
}

type QuizState = 'INTAKE' | 'QUIZ' | 'RESULTS';

export default function QuizApp({ questionsPool }: QuizAppProps) {
  const [view, setView] = useState<QuizState>('INTAKE');
  
  // User Data
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [difficulty, setDifficulty] = useState(1);

  // Quiz Data
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); 
  
  const startQuiz = () => {
    if (!name || !position) return;
    
    // Filter questions by difficulty
    const filtered = questionsPool.filter(q => q.k_hops === difficulty);
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    if (shuffled.length === 0) {
      alert("Insufficient questions available for this difficulty tier.");
      return;
    }
    
    setActiveQuestions(shuffled);
    setView('QUIZ');
  };

  const handleAnswer = (optionChar: string) => {
    setUserAnswers(prev => ({ ...prev, [activeQuestions[currentIndex].id]: optionChar }));
  };

  const nextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const userScore = activeQuestions.reduce((acc, q) => {
      return acc + (userAnswers[q.id] === q.correct_answer ? 1 : 0);
    }, 0);

    const modelScore = activeQuestions.reduce((acc, q) => {
      return acc + (q.model_correct ? 1 : 0);
    }, 0);

    setView('RESULTS');
    await submitQuizResult({
      name,
      position,
      difficulty,
      userScore,
      modelScore
    });
  };

  // --- VIEW 1: INTAKE ---
  if (view === 'INTAKE') {
    const isReady = name.trim().length > 0 && position.trim().length > 0;

    return (
      <div className="max-w-xl mx-auto mt-12 animate-fade-in-up">
        <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden bg-white border border-slate-200 shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} className="text-blue-900" />
          </div>

          <h2 className="font-serif text-3xl mb-2 text-slate-900 font-bold">Session Intake</h2>
          <p className="text-slate-600 mb-8 text-sm">Please initialize your researcher profile.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Researcher ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-slate-50 pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900" 
                  placeholder="e.g. Dr. A. Turing" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Role / Title</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  value={position} 
                  onChange={e => setPosition(e.target.value)} 
                  className="w-full bg-slate-50 pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900" 
                  placeholder="e.g. Senior Analyst" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Reasoning Complexity</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setDifficulty(n)}
                    className={clsx(
                      "flex-1 py-3 rounded-lg text-sm font-bold border transition-all duration-200",
                      difficulty === n 
                        ? "bg-blue-900 text-white border-blue-900 shadow-lg scale-105" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* BLUE BUTTON FIX */}
            <button 
              onClick={startQuiz} 
              disabled={!isReady}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2"
            >
              Initialize Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: QUIZ ---
  if (view === 'QUIZ') {
    const question = activeQuestions[currentIndex];
    const selected = userAnswers[question.id];
    const progress = ((currentIndex + 1) / activeQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto mt-8 animate-fade-in-up">
        <div className="flex justify-between items-end mb-3 px-1">
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-blue-800 tracking-wider">REASONING TASK {currentIndex + 1} / {activeQuestions.length}</span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">DIFFICULTY: {difficulty}-HOP</span>
          </div>
          <div className="text-xs font-mono text-slate-400">SESSION ID: ACTIVE</div>
        </div>
        
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200">
          <div className="h-1 w-full bg-slate-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h3 className="text-2xl md:text-3xl font-serif font-medium leading-relaxed text-slate-900">
                {question.question}
              </h3>
            </div>

            <div className="space-y-4">
              {question.options.map((opt, idx) => {
                 const char = ["A", "B", "C", "D"][idx]; 
                 const isSelected = selected === char;
                 
                 return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(char)}
                    className={clsx(
                      "group w-full text-left p-5 border rounded-xl transition-all duration-200 flex items-start gap-4",
                      isSelected 
                        ? "border-blue-900 bg-blue-50 ring-1 ring-blue-900 shadow-md" 
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    )}
                  >
                    <span className={clsx(
                      "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors mt-0.5",
                      isSelected 
                        ? "bg-blue-900 text-white" 
                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700"
                    )}>
                      {char}
                    </span>
                    <span className={clsx(
                      "text-lg leading-snug",
                      isSelected ? "font-medium text-slate-900" : "text-slate-600"
                    )}>
                      {opt}
                    </span>
                  </button>
                 )
              })}
            </div>

            <div className="mt-10 flex justify-end">
              {/* BLUE BUTTON FIX */}
              <button 
                onClick={nextQuestion} 
                disabled={!selected}
                className={clsx(
                  "px-8 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
                  selected 
                    ? "bg-blue-900 text-white shadow-lg hover:bg-blue-800 hover:-translate-y-0.5" 
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                )}
              >
                {currentIndex === activeQuestions.length - 1 ? "Submit Logic Trace" : "Next Scenario"}
                {selected && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: RESULTS ---
  if (view === 'RESULTS') {
    const userScore = activeQuestions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correct_answer ? 1 : 0), 0);
    const modelScore = activeQuestions.reduce((acc, q) => acc + (q.model_correct ? 1 : 0), 0);
    const userWin = userScore >= modelScore;
    
    return (
      <div className="max-w-5xl mx-auto mt-10 pb-24 animate-fade-in-up">
        <div className="glass-panel p-8 md:p-10 rounded-2xl mb-12 flex flex-col md:flex-row gap-10 items-center justify-between bg-white border border-slate-200">
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Performance Audit</h2>
            <p className="text-slate-600 leading-relaxed">
              Comparison against <span className="font-semibold text-slate-900">Qwen-2.5-32B</span> (Chain-of-Thought enabled).
            </p>
          </div>

          <div className="flex gap-12 text-center">
            <div className="relative group">
              <div className="text-5xl font-bold text-slate-900 mb-1">{userScore}<span className="text-2xl text-slate-400">/10</span></div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Human Expert</div>
            </div>
            
            <div className="h-16 w-px bg-slate-200"></div>

            <div className="relative">
              <div className={clsx("text-5xl font-bold mb-1", !userWin ? "text-slate-900" : "text-slate-400")}>
                {modelScore}<span className="text-2xl text-slate-200">/10</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Model Baseline</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2 px-2">
            <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Detailed Logic Traces</h3>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>

          {activeQuestions.map((q, idx) => (
            <ResultCard key={q.id} question={q} userAnswer={userAnswers[q.id]} index={idx} />
          ))}
        </div>

        <div className="mt-16 text-center">
             <button 
                onClick={() => window.location.reload()}
                className="group text-slate-500 hover:text-blue-900 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Start New Session
            </button>
        </div>
      </div>
    );
  }
}