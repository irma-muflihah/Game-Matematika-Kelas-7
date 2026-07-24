import React, { useState, useEffect } from 'react';
import { EquationProblem } from '../types';
import { Scale, CheckCircle, RefreshCw, AlertCircle, ArrowRight, HelpCircle, ChevronRight, Home } from 'lucide-react';

const PROBLEMS: EquationProblem[] = [
  {
    id: 'eq_1',
    level: 1,
    question: 'Di lengan kiri timbangan terdapat 1 buah kotak misterius x dan 3 beban pemberat @1 kg. Di lengan kanan timbangan terdapat 7 beban pemberat @1 kg. Jika timbangan seimbang, berapakah berat kotak x?',
    leftX: 1,
    leftConstants: 3,
    rightX: 0,
    rightConstants: 7,
    solution: 4,
    pedagogy: {
      diketahui: ['Lengan Kiri = 1 Kotak x + 3 Beban (x + 3)', 'Lengan Kanan = 7 Beban (7)'],
      ditanya: 'Berat kotak misterius x agar kedua ruas timbangan tetap seimbang.',
      correctModel: 'x + 3 = 7',
      modelOptions: ['x + 3 = 7', 'x - 3 = 7', '3x = 7', 'x + 7 = 3'],
      explanation: 'Model persamaan linearnya adalah x + 3 = 7. Untuk mencari x, kita kurangi 3 beban dari kedua ruas timbangan secara bersamaan (invers operasi), menyisakan x di kiri dan 4 di kanan. Maka x = 4 kg.'
    }
  },
  {
    id: 'eq_2',
    level: 2,
    question: 'Sebuah timbangan seimbang memiliki 1 kotak misterius x dan 5 beban @1 kg di lengan kiri, serta 9 beban @1 kg di lengan kanan. Berapakah nilai x?',
    leftX: 1,
    leftConstants: 5,
    rightX: 0,
    rightConstants: 9,
    solution: 4,
    pedagogy: {
      diketahui: ['Lengan Kiri = x + 5', 'Lengan Kanan = 9'],
      ditanya: 'Nilai variabel x yang memenuhi persamaan tersebut.',
      correctModel: 'x + 5 = 9',
      modelOptions: ['x - 5 = 9', 'x + 5 = 9', '5x = 9', 'x = 9 + 5'],
      explanation: 'Persamaan awalnya x + 5 = 9. Kurangi kedua ruas dengan 5 beban, menyisakan x = 9 - 5, sehingga nilai x = 4.'
    }
  }
];

export default function EquationBalancer({ onScoreSaved, onBackToMenu }: { onScoreSaved: (score: number) => void; onBackToMenu: () => void }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pedagogyStep, setPedagogyStep] = useState<1 | 2 | 3 | 4>(1);

  const problem = PROBLEMS[currentLevelIdx];
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isModelCorrect, setIsModelCorrect] = useState<boolean | null>(null);

  // Active Weight Balancer States
  const [currentLeftX, setCurrentLeftX] = useState(problem.leftX);
  const [currentLeftConstants, setCurrentLeftConstants] = useState(problem.leftConstants);
  const [currentRightX, setCurrentRightX] = useState(problem.rightX);
  const [currentRightConstants, setCurrentRightConstants] = useState(problem.rightConstants);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Reset weights and parameters for next levels
    setSelectedModel(null);
    setIsModelCorrect(null);
    setErrorMessage('');
    setPedagogyStep(1);

    setCurrentLeftX(problem.leftX);
    setCurrentLeftConstants(problem.leftConstants);
    setCurrentRightX(problem.rightX);
    setCurrentRightConstants(problem.rightConstants);
  }, [currentLevelIdx]);

  // Total calculated weight assuming x is its correct target weight
  // In the simulator we will calculate the balance based on absolute values
  const leftTotalWeight = (currentLeftX * problem.solution) + currentLeftConstants;
  const rightTotalWeight = (currentRightX * problem.solution) + currentRightConstants;
  
  // Calculate if the scales are balanced
  // True balance in math modeling: LHS == RHS
  const isBalanced = currentLeftConstants === (currentRightConstants - (currentLeftX * problem.solution)); 
  // Let's do a simple math check: is current state solved? 
  // Solved when currentLeftX === 1, currentLeftConstants === 0, currentRightX === 0, currentRightConstants === problem.solution
  const isSolved = currentLeftX === 1 && currentLeftConstants === 0 && currentRightConstants === problem.solution && currentRightX === 0;

  const handleVerifyModel = () => {
    if (selectedModel === problem.pedagogy.correctModel) {
      setIsModelCorrect(true);
      setErrorMessage('');
      setTimeout(() => {
        setPedagogyStep(3);
      }, 1000);
    } else {
      setIsModelCorrect(false);
      setErrorMessage('Persamaan linear tidak cocok dengan ilustrasi lengan timbangan!');
    }
  };

  // Balance scale interactive controllers
  const subtractConstants = (amount: number) => {
    if (currentLeftConstants >= amount && currentRightConstants >= amount) {
      setCurrentLeftConstants((prev) => prev - amount);
      setCurrentRightConstants((prev) => prev - amount);
      setErrorMessage('');
    } else {
      setErrorMessage('Tidak bisa mengurangi berat tersebut! Salah satu lengan tidak memiliki beban konstanta yang cukup.');
    }
  };

  const handleVerifyBalance = () => {
    if (isSolved) {
      setTotalScore((prev) => prev + 120);
      setPedagogyStep(4);
      setErrorMessage('');
    } else {
      setErrorMessage('Timbangan seimbang, tetapi kotak x belum terisolasi penuh di ruas kiri dengan konstanta 0!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < PROBLEMS.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
    } else {
      onScoreSaved(totalScore);
    }
  };

  // Simple tilt angle for graphics
  // 0 is balanced, negative is left-heavy, positive is right-heavy
  const leftWeightSum = (currentLeftX * 4) + currentLeftConstants; // assume visual weight
  const rightWeightSum = (currentRightX * 4) + currentRightConstants;
  const diff = rightWeightSum - leftWeightSum;
  const tiltAngle = Math.max(-15, Math.min(15, diff * 2)); // degrees

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in text-slate-100">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Topic: SPLSV</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5 font-display uppercase">
            <Scale className="w-7 h-7 text-amber-400 animate-pulse" />
            Equation Balancer Scale
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Level</span>
            <span className="text-lg font-black text-amber-400">{problem.level} / {PROBLEMS.length}</span>
          </div>
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Total Skor</span>
            <span className="text-lg font-black text-orange-400">{totalScore} Pts</span>
          </div>
          <button
            onClick={onBackToMenu}
            className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all active:scale-95 text-slate-300 cursor-pointer"
            title="Kembali ke Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Polya Pedagogy */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xxs font-extrabold text-slate-500 uppercase tracking-widest block">Tahapan Pemecahan Masalah (Polya)</span>
            <div className="flex justify-between mt-3 text-xs font-bold text-slate-400">
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 1 ? 'border-amber-400 text-amber-400 font-extrabold' : 'border-transparent'}`}>1. Pahami</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 2 ? 'border-amber-400 text-amber-400 font-extrabold' : 'border-transparent'}`}>2. Model</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 3 ? 'border-amber-400 text-amber-400 font-extrabold' : 'border-transparent'}`}>3. Selesaikan</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 4 ? 'border-amber-400 text-amber-400 font-extrabold' : 'border-transparent'}`}>4. Verifikasi</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
            <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Soal Timbangan Linear:
            </h3>
            <p className="text-white font-bold text-sm md:text-base leading-relaxed">
              {problem.question}
            </p>
          </div>

          {/* STEP 1 */}
          {pedagogyStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">Identifikasi Diketahui:</span>
                <div className="space-y-2 text-xs md:text-sm text-slate-300">
                  {problem.pedagogy.diketahui.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-2 mt-2 text-slate-200 font-medium">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Ditanya:</span>
                    {problem.pedagogy.ditanya}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPedagogyStep(2)}
                className="w-full py-4 bg-amber-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
              >
                Susun Persamaan Aljabar
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {pedagogyStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilih Persamaan yang Sesuai:</span>
                <div className="grid grid-cols-2 gap-3">
                  {problem.pedagogy.modelOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedModel(option);
                        setIsModelCorrect(null);
                      }}
                      className={`p-4 rounded-xl border-2 text-center font-mono font-bold text-sm md:text-base transition-all cursor-pointer ${
                        selectedModel === option
                          ? 'border-amber-500 bg-amber-950/30 text-amber-200 shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {selectedModel && (
                <button
                  onClick={handleVerifyModel}
                  className="w-full py-4 bg-amber-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
                >
                  Verifikasi Persamaan
                </button>
              )}

              {isModelCorrect === false && (
                <div className="bg-red-950/40 text-red-300 p-3.5 rounded-xl border border-red-900/60 text-xs flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {pedagogyStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/40 text-xs md:text-sm space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Metode Invers Neraca:</span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Agar nilai <strong className="text-amber-400">x</strong> terisolasi di sisi kiri, kurangi beban pemberat di kedua sisi secara merata!
                </p>
                <div className="bg-slate-950 text-white font-mono text-center py-2 rounded text-xs border border-slate-850">
                  {currentLeftX}x + {currentLeftConstants} = {currentRightConstants}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCurrentLeftX(problem.leftX);
                    setCurrentLeftConstants(problem.leftConstants);
                    setCurrentRightX(problem.rightX);
                    setCurrentRightConstants(problem.rightConstants);
                    setErrorMessage('');
                  }}
                  className="px-4 py-3 bg-slate-800 border border-slate-750 rounded-xl hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Timbangan
                </button>
                <button
                  onClick={handleVerifyBalance}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow text-xs flex items-center justify-center gap-1 active:translate-y-1 cursor-pointer"
                >
                  Uji Nilai x ✓
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-950/40 text-red-300 p-3.5 rounded-xl border border-red-900/60 text-xs flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {pedagogyStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-950/40 text-emerald-300 p-5 rounded-2xl border border-emerald-900/60 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Persamaan Berhasil Dipecahkan!
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {problem.pedagogy.explanation}
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/40 text-xs font-semibold">
                  Maka solusi akhir variabel adalah: <strong>x = {problem.solution} kg</strong>.
                </div>
              </div>

              <button
                onClick={handleNextLevel}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black tracking-widest uppercase rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
              >
                {currentLevelIdx < PROBLEMS.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesaikan Tantangan & Simpan Skor!'}
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Visual Scale Interactive Engine */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-8 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Top aesthetic color bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-900/40">
                Simulator Neraca Aljabar Dua Lengan
              </span>
              <div className="text-xs font-mono text-amber-400 font-bold bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40">
                Status: {Math.abs(tiltAngle) < 2 ? 'SEIMBANG ✓' : 'TIDAK SEIMBANG ✗'}
              </div>
            </div>

            {/* Scale Vector Graphic representation */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 py-12 px-6 relative h-[260px] flex flex-col justify-between items-center overflow-hidden">
              {/* Stand / Pillar */}
              <div className="absolute bottom-0 w-8 h-32 bg-slate-800 border-t-2 border-x-2 border-slate-750 rounded-t-md z-0 flex flex-col justify-end items-center">
                <div className="w-16 h-4 bg-slate-700 rounded-full mb-1"></div>
              </div>

              {/* Tilting Hanger Bar */}
              <div
                className="w-4/5 h-2 bg-slate-650 relative z-10 rounded transition-transform duration-700 ease-out flex justify-between items-center px-4"
                style={{
                  transform: `rotate(${tiltAngle}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Pivot Center Pin */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 z-20"></div>

                {/* Left Pan Attachment */}
                <div
                  className="absolute left-4 top-1.5 transition-transform duration-700 flex flex-col items-center"
                  style={{
                    transform: `rotate(${-tiltAngle}deg)`,
                    transformOrigin: 'top center'
                  }}
                >
                  {/* Hanger wires */}
                  <div className="w-20 h-16 border-l border-r border-slate-750 rounded-b-3xl relative"></div>
                  {/* Actual Plate */}
                  <div className="w-24 h-2 bg-slate-600 rounded-full shadow-lg relative flex flex-col items-center justify-end">
                    {/* Items on left plate */}
                    <div className="absolute -top-10 flex flex-wrap gap-1 justify-center max-w-[80px]">
                      {/* Box x */}
                      {Array.from({ length: currentLeftX }).map((_, i) => (
                        <div key={`lx-${i}`} className="w-8 h-8 bg-amber-500 border border-amber-300 rounded-lg flex items-center justify-center font-black font-mono text-slate-950 text-xs shadow-md">
                          x
                        </div>
                      ))}
                      {/* Constants */}
                      {Array.from({ length: currentLeftConstants }).map((_, i) => (
                        <div key={`lc-${i}`} className="w-4 h-4 bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center font-mono text-[9px] text-white shadow-sm">
                          1
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-bold">Ruas Kiri</span>
                </div>

                {/* Right Pan Attachment */}
                <div
                  className="absolute right-4 top-1.5 transition-transform duration-700 flex flex-col items-center"
                  style={{
                    transform: `rotate(${-tiltAngle}deg)`,
                    transformOrigin: 'top center'
                  }}
                >
                  {/* Hanger wires */}
                  <div className="w-20 h-16 border-l border-r border-slate-750 rounded-b-3xl relative"></div>
                  {/* Actual Plate */}
                  <div className="w-24 h-2 bg-slate-600 rounded-full shadow-lg relative flex flex-col items-center justify-end">
                    {/* Items on right plate */}
                    <div className="absolute -top-10 flex flex-wrap gap-1 justify-center max-w-[80px]">
                      {/* Constants */}
                      {Array.from({ length: currentRightConstants }).map((_, i) => (
                        <div key={`rc-${i}`} className="w-4 h-4 bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center font-mono text-[9px] text-white shadow-sm">
                          1
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-bold">Ruas Kanan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Classroom Inverse Controllers */}
          {pedagogyStep === 3 && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Operasi Setara Kedua Ruas (Invers):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => subtractConstants(1)}
                  className="py-3 px-3 bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-300 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Kurangi 1 kg (-1)
                </button>
                <button
                  onClick={() => subtractConstants(3)}
                  className="py-3 px-3 bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-300 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Kurangi 3 kg (-3)
                </button>
                <button
                  onClick={() => subtractConstants(5)}
                  className="py-3 px-3 bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 text-red-300 font-bold rounded-xl text-xs active:scale-95 transition-all col-span-2 sm:col-span-1 cursor-pointer"
                >
                  Kurangi 5 kg (-5)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pedagogical Framework Footer */}
      <footer className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 1 
            ? 'bg-amber-950/40 border-amber-900 text-amber-400' 
            : pedagogyStep === 1 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">1. Understand</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Identifikasi Diketahui &amp; Ditanya</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 2 
            ? 'bg-amber-950/40 border-amber-900 text-amber-400' 
            : pedagogyStep === 2 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">2. Modeling</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Konstruksi Model Matematika</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 3 
            ? 'bg-amber-950/40 border-amber-900 text-amber-400' 
            : pedagogyStep === 3 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">3. Solve</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Implementasi Strategi Solusi</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 4 
            ? 'bg-amber-950/40 border-amber-900 text-amber-400' 
            : pedagogyStep === 4 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">4. Verify</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Verifikasi Hasil &amp; Kesimpulan</div>
        </div>
      </footer>
    </div>
  );
}
