import React, { useState } from 'react';
import { Topic, Score, Student } from './types';
import MainMenu from './components/MainMenu';
import LearningObjectives from './components/LearningObjectives';
import IntegerRace from './components/IntegerRace';
import VennMaster from './components/VennMaster';
import EquationBalancer from './components/EquationBalancer';
import LkpdGenerator from './components/LkpdGenerator';
import Leaderboard from './components/Leaderboard';
import SystemArchitecture from './components/SystemArchitecture';
import { GraduationCap, FileText, Award, Cpu, Home, ArrowLeft } from 'lucide-react';

type Screen = 'menu' | 'ipk' | 'game' | 'leaderboard' | 'lkpd' | 'architecture';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('integers');
  const [pendingScore, setPendingScore] = useState<number | null>(null);

  // Student roster state persisted in LocalStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const stored = localStorage.getItem('math_playground_students');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentPlayer, setCurrentPlayer] = useState<Student | null>(null);

  const handleSetStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('math_playground_students', JSON.stringify(newStudents));
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentScreen('ipk');
  };

  const handleStartGame = () => {
    setPendingScore(null); // Reset pending scores
    setCurrentScreen('game');
  };

  const handleGameFinished = (finalScore: number) => {
    setPendingScore(finalScore);
    setCurrentScreen('leaderboard');
  };

  const handleSaveScoreComplete = (name: string, className: string, score: number) => {
    setPendingScore(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      
      {/* 70-inch Classroom Header Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Brand/Launcher Logo */}
          <div
            onClick={() => {
              setPendingScore(null);
              setCurrentScreen('menu');
            }}
            className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all group-hover:scale-105">
              Σ
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-cyan-500 tracking-wider uppercase block leading-none">Fase D SMP Kelas VII</span>
              <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase mt-1">
                MathLab <span className="text-cyan-500 text-sm">Enterprise Pro</span>
              </h1>
            </div>
          </div>

          {/* Quick Access teacher controls */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => {
                setPendingScore(null);
                setCurrentScreen('menu');
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'menu'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
              id="nav-btn-home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => {
                setPendingScore(null);
                setCurrentScreen('lkpd');
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'lkpd'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
              id="nav-btn-lkpd"
            >
              <FileText className="w-4 h-4" />
              <span>Cetak LKPD</span>
            </button>

            <button
              onClick={() => {
                setPendingScore(null);
                setCurrentScreen('leaderboard');
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'leaderboard'
                  ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
              id="nav-btn-scores"
            >
              <Award className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => {
                setPendingScore(null);
                setCurrentScreen('architecture');
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'architecture'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
              id="nav-btn-architecture"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">Arsitektur</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Orchestrated View Screen */}
      <main className="flex-grow py-8 bg-slate-950">
        
        {currentScreen === 'menu' && (
          <MainMenu
            onSelectTopic={handleSelectTopic}
            onViewLeaderboard={() => setCurrentScreen('leaderboard')}
            onViewArchitecture={() => setCurrentScreen('architecture')}
            students={students}
            onStudentsChange={handleSetStudents}
          />
        )}

        {currentScreen === 'ipk' && (
          <LearningObjectives
            topic={selectedTopic}
            onStart={handleStartGame}
            onBack={() => setCurrentScreen('menu')}
            students={students}
            currentPlayer={currentPlayer}
            onSelectPlayer={setCurrentPlayer}
          />
        )}

        {currentScreen === 'game' && (
          <>
            {selectedTopic === 'integers' && (
              <IntegerRace
                onScoreSaved={handleGameFinished}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            )}
            {selectedTopic === 'sets' && (
              <VennMaster
                onScoreSaved={handleGameFinished}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            )}
            {selectedTopic === 'equations' && (
              <EquationBalancer
                onScoreSaved={handleGameFinished}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            )}
          </>
        )}

        {currentScreen === 'leaderboard' && (
          <Leaderboard
            activeTopic={selectedTopic}
            pendingScore={pendingScore}
            onSaveNewScore={handleSaveScoreComplete}
            onBack={() => setCurrentScreen('menu')}
            currentPlayer={currentPlayer}
          />
        )}

        {currentScreen === 'lkpd' && (
          <LkpdGenerator
            initialTopic={selectedTopic}
            onBack={() => setCurrentScreen('menu')}
          />
        )}

        {currentScreen === 'architecture' && (
          <div className="px-6">
            <button
              onClick={() => setCurrentScreen('menu')}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-1 active:scale-95 transition-all max-w-5xl mx-auto"
            >
              ← Kembali ke Menu
            </button>
            <SystemArchitecture />
          </div>
        )}

      </main>

      {/* Classroom Footer Status Bar */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div>
            <span>Math Playground v1.2.0 • Optimasi Panel Sentuh 70" (3840x2160)</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Model Pemecahan Masalah Polya Terintegrasi</span>
            <span>Kurikulum Merdeka 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
