import React, { useState } from 'react';
import { BookOpen, Network, FolderTree, Smartphone, Cpu, Layers } from 'lucide-react';

export default function SystemArchitecture() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'files' | 'roadmap'>('architecture');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white max-w-5xl mx-auto my-6 shadow-2xl relative overflow-hidden">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3 font-display uppercase">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
            Classroom Display Architecture
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Enterprise Blueprint &amp; Scalability Specs for 70" Large Digital Interactive Panels (4K Optimized)
          </p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'architecture' ? 'bg-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'files' ? 'bg-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Structure
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap' ? 'bg-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Roadmap
          </button>
        </div>
      </div>

      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2 text-base font-display uppercase tracking-wider">
                <span className="p-1.5 bg-cyan-950/80 rounded-lg text-cyan-400 border border-cyan-900/30 text-xs">01</span>
                Interaction Layer
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Optimized for <strong>70" 4K interactive whiteboards</strong> (3840x2160 native canvas layout). 
                Implements large touch coordinates (min 44px up to 72px targets) to minimize physical clicking error and ensure 
                smooth visual parallax for classroom visibility.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2 text-base font-display uppercase tracking-wider">
                <span className="p-1.5 bg-emerald-950/80 rounded-lg text-emerald-400 border border-emerald-900/30 text-xs">02</span>
                Pedagogical Engine
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Sequences learning state through a strict <strong>4-step problem solving framework</strong>. Each mathematical task has a clear IPK indicator, forces analytical modeling before play, and generates structured printable LKPD work documents.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="text-indigo-400 font-bold mb-2 flex items-center gap-2 text-base font-display uppercase tracking-wider">
                <span className="p-1.5 bg-indigo-950/80 rounded-lg text-indigo-400 border border-indigo-900/30 text-xs">03</span>
                Scalable Backend
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Separated state engine allows a modular REST and state controller to smoothly bridge local <strong>LocalStorage/Firestore DB</strong> to active <strong>WebSockets</strong> for real-time mobile response overlays.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl mt-4">
            <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center gap-2 font-display uppercase tracking-wide">
              <Network className="w-5 h-5 text-indigo-400" />
              Classroom Tech Stack Diagram (Offline-First / Real-time Hydrated)
            </h3>
            
            {/* Architectural Flowchart */}
            <div className="flex flex-col md:flex-row items-stretch justify-around gap-4 text-center text-xs font-mono my-4">
              <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-xl flex-1 flex flex-col justify-center">
                <div className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Teacher Panel (Main Frame)</div>
                <div className="text-white font-semibold my-1 text-sm">Large Digital Display UI</div>
                <div className="text-slate-400 text-xxs">React SPA / Tailwind 4K</div>
              </div>
              <div className="flex items-center justify-center text-indigo-400 text-lg">➔</div>
              <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl flex-1 flex flex-col justify-center">
                <div className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Scoring &amp; Pedagogy</div>
                <div className="text-white font-semibold my-1 text-sm">Offline State Engine</div>
                <div className="text-slate-400 text-xxs">Local JSON DB / jsPDF LKPD</div>
              </div>
              <div className="flex items-center justify-center text-indigo-400 text-lg">➔</div>
              <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-xl flex-1 flex flex-col justify-center">
                <div className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Future Expansion</div>
                <div className="text-white font-semibold my-1 text-sm">WS Socket Controller</div>
                <div className="text-slate-400 text-xxs">Smartphone Buzzer Overlay</div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              * Design Principle: Standardizing on lightweight canvas rendering for physical displays ensures there are no HMR stutter effects or canvas delay when school devices have weak local graphics hardware.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
            <h3 className="text-indigo-400 font-bold mb-4 font-sans text-sm uppercase tracking-wider">Proposed System File Hierarchy:</h3>
            <div className="space-y-1">
              <div>📁 <span className="text-white">src/</span></div>
              <div className="pl-4">📁 <span className="text-indigo-300 font-bold">components/</span> <span className="text-slate-500"># Interactive modules</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">MainMenu.tsx</span> <span className="text-emerald-500 font-sans text-xs">(Touch-friendly panel selection)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">LearningObjectives.tsx</span> <span className="text-emerald-500 font-sans text-xs">(IPK indicators &amp; targets)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">IntegerRace.tsx</span> <span className="text-emerald-500 font-sans text-xs">(Interactive number line module)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">VennMaster.tsx</span> <span className="text-emerald-500 font-sans text-xs">(Sets Drag-and-Drop system)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">EquationBalancer.tsx</span> <span className="text-emerald-500 font-sans text-xs">(SPLSV Balance weight visualizer)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">Leaderboard.tsx</span> <span className="text-emerald-500 font-sans text-xs">(Classroom session score boards)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">LkpdGenerator.tsx</span> <span className="text-emerald-500 font-sans text-xs">(PDF worksheet generator)</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">SystemArchitecture.tsx</span> <span className="text-emerald-500 font-sans text-xs">(This system details modal)</span></div>
              <div className="pl-4">📁 <span className="text-indigo-300 font-bold">lib/</span> <span className="text-slate-500"># Core helper classes</span></div>
              <div className="pl-8">📄 <span className="text-slate-400">pdfHelper.ts</span> <span className="text-emerald-500 font-sans text-xs">(Strict A4 curriculum layouts)</span></div>
              <div className="pl-4">📄 <span className="text-slate-400">App.tsx</span> <span className="text-slate-500"># Global Router &amp; State Controller</span></div>
              <div className="pl-4">📄 <span className="text-slate-400">types.ts</span> <span className="text-slate-500"># Strongly typed TS models</span></div>
              <div className="pl-4">📄 <span className="text-slate-400">index.css</span> <span className="text-slate-500"># Tailwind configurations</span></div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            This modular directory maps cleanly to any standard Vite/React project, allowing developers to extend features without changing the global orchestrator.
          </p>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center gap-2 font-display uppercase tracking-wider">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              Future-Proofing: Mobile-to-Screen Integration Plan
            </h3>
            
            <div className="relative border-l border-indigo-500/30 pl-6 ml-4 space-y-8 my-4">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-indigo-600 rounded-full w-4 h-4 border-2 border-slate-900"></span>
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">Phase 1: WebSocket Orchestration Server</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Deploy a Node.js Express server configured with <code>socket.io</code>. Establish unique classroom PIN codes (e.g., <code>GAME-401</code>) so mobile controllers connect directly to the shared whiteboards without complex logins.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-emerald-600 rounded-full w-4 h-4 border-2 border-slate-900"></span>
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">Phase 2: Smartphone Controller Views</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Build responsive mobile layouts (using Tailwind and virtual buzzers). Students drag tiles, tap options, or balance their digital scales directly on their smartphones, sending lightweight JSON patches to the screen.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-cyan-600 rounded-full w-4 h-4 border-2 border-slate-900"></span>
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Phase 3: Real-time Multi-Student Overlays</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Update the main whiteboard to render multiple cars in <strong>Integer Race</strong> (representing distinct student scores concurrently), or divide the <strong>Venn Master</strong> into collaborative group challenges with live buzzer triggers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
