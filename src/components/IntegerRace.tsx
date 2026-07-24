import React, { useState, useEffect } from 'react';
import { IntegerProblem } from '../types';
import { Car, ChevronRight, HelpCircle, CheckCircle, RefreshCw, AlertCircle, ArrowRight, Home } from 'lucide-react';

interface IntegerRaceProps {
  onScoreSaved: (score: number) => void;
  onBackToMenu: () => void;
}

const PROBLEMS: IntegerProblem[] = [
  {
    id: 'int_1',
    level: 1,
    question: 'Sebuah mobil mainan mula-mula berada di titik 2. Mobil tersebut kemudian bergerak MAJU sejauh 5 satuan. Di manakah posisi mobil sekarang?',
    startPos: 2,
    operation: 'add',
    operand: 5,
    targetPos: 7,
    pedagogy: {
      diketahui: ['Posisi awal mobil = 2', 'Bergerak maju = +5 satuan'],
      ditanya: 'Posisi akhir mobil setelah bergerak.',
      correctModel: '2 + 5',
      modelOptions: ['2 + 5', '2 - 5', '2 + (-5)', '-2 + 5'],
      explanation: 'Posisi awal adalah 2. Berjalan ke arah kanan (maju) sejauh 5 langkah, sehingga berakhir di posisi 7.'
    }
  },
  {
    id: 'int_2',
    level: 2,
    question: 'Seekor katak berada di titik 3 pada garis bilangan. Katak tersebut berbalik arah (menghadap kiri) lalu MELANGKAH MAJU sejauh 7 satuan. Di titik berapakah katak sekarang?',
    startPos: 3,
    operation: 'subtract',
    operand: 7,
    targetPos: -4,
    pedagogy: {
      diketahui: ['Posisi awal = 3', 'Berbalik arah (pengurangan) = Menghadap ke kiri', 'Melangkah maju = 7 langkah'],
      ditanya: 'Posisi akhir katak.',
      correctModel: '3 - 7',
      modelOptions: ['3 + 7', '3 - 7', '3 + (-7)', '-3 + 7'],
      explanation: 'Berbalik arah dilambangkan dengan operasi pengurangan (-). Katak melangkah maju 7 langkah ke kiri dari posisi 3, berakhir di posisi -4.'
    }
  },
  {
    id: 'int_3',
    level: 3,
    question: 'Lumba-lumba melompat dari kedalaman laut 2 meter di bawah permukaan (-2). Ia kemudian meluncur MUNDUR (ke arah berlawanan) sejauh 4 meter. Berapakah posisi lumba-lumba sekarang?',
    startPos: -2,
    operation: 'subtract',
    operand: 4,
    targetPos: -6,
    pedagogy: {
      diketahui: ['Kedalaman laut awal = -2', 'Meluncur mundur = -4 meter'],
      ditanya: 'Posisi akhir kedalaman lumba-lumba.',
      correctModel: '-2 - 4',
      modelOptions: ['-2 + 4', '-2 - 4', '2 - 4', '-2 + (-4)'],
      explanation: 'Awal di -2. Pengurangan (-) berarti berbalik menghadap kiri, lalu maju 4 langkah, berakhir di posisi -6.'
    }
  }
];

export default function IntegerRace({ onScoreSaved, onBackToMenu }: IntegerRaceProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pedagogyStep, setPedagogyStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Game state
  const problem = PROBLEMS[currentLevelIdx];
  const [carPos, setCarPos] = useState(problem.startPos);
  const [carFacing, setCarFacing] = useState<'right' | 'left'>('right'); // right = positive, left = negative
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isModelCorrect, setIsModelCorrect] = useState<boolean | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [userConclusion, setUserConclusion] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset states for new level
  useEffect(() => {
    const currentProblem = PROBLEMS[currentLevelIdx];
    setCarPos(currentProblem.startPos);
    setCarFacing('right');
    setSelectedModel(null);
    setIsModelCorrect(null);
    setHasMoved(false);
    setUserConclusion(null);
    setErrorMessage('');
    setPedagogyStep(1);
  }, [currentLevelIdx]);

  // Handle Model check
  const handleVerifyModel = () => {
    if (selectedModel === problem.pedagogy.correctModel) {
      setIsModelCorrect(true);
      setErrorMessage('');
      // Automatically advance to Step 3 after success
      setTimeout(() => {
        setPedagogyStep(3);
      }, 1000);
    } else {
      setIsModelCorrect(false);
      setErrorMessage('Model matematika kurang tepat. Perhatikan arah pergerakan pada soal!');
    }
  };

  // Car operations for interactive line
  const moveCar = (steps: number) => {
    const newPos = carPos + steps;
    if (newPos >= -10 && newPos <= 10) {
      setCarPos(newPos);
      setHasMoved(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Mobil menabrak batas lintasan garis bilangan (-10 s/d 10)!');
    }
  };

  const toggleFacing = () => {
    setCarFacing(carFacing === 'right' ? 'left' : 'right');
  };

  const handleVerifyPosition = () => {
    if (carPos === problem.targetPos) {
      setTotalScore((prev) => prev + 100);
      setPedagogyStep(4);
      setErrorMessage('');
    } else {
      setErrorMessage(`Posisi mobil belum tepat. Target posisi yang benar adalah ${problem.targetPos}. Gerakkan mobil ke titik tersebut!`);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < PROBLEMS.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
    } else {
      onScoreSaved(totalScore);
    }
  };

  // Helper to generate positions for the 1D line (-10 to 10)
  const linePoints = [];
  for (let i = -10; i <= 10; i++) {
    linePoints.push(i);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in text-slate-100">
      {/* Top Game Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Topic: Bilangan Bulat</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5 font-display uppercase">
            <Car className="w-7 h-7 text-cyan-400 animate-bounce" />
            Integer Race Simulator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Level</span>
            <span className="text-lg font-black text-cyan-400">{problem.level} / {PROBLEMS.length}</span>
          </div>
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Total Skor</span>
            <span className="text-lg font-black text-emerald-400">{totalScore} Pts</span>
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

      {/* Grid: Left column handles Pedagogy Flow (Polya), Right column hosts interactive graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Pedagogical Stages (Polya Guide) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xxs font-extrabold text-slate-500 uppercase tracking-widest block">Tahapan Pemecahan Masalah (Polya)</span>
            
            {/* Visual Step Indicator */}
            <div className="flex justify-between mt-3 text-xs font-bold text-slate-400">
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 1 ? 'border-cyan-400 text-cyan-400 font-extrabold' : 'border-transparent'}`}>1. Pahami</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 2 ? 'border-cyan-400 text-cyan-400 font-extrabold' : 'border-transparent'}`}>2. Model</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 3 ? 'border-cyan-400 text-cyan-400 font-extrabold' : 'border-transparent'}`}>3. Selesaikan</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 4 ? 'border-cyan-400 text-cyan-400 font-extrabold' : 'border-transparent'}`}>4. Verifikasi</span>
            </div>
          </div>

          {/* QUESTION BOX */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
            <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Soal Cerita Kontekstual:
            </h3>
            <p className="text-white font-bold text-sm md:text-base leading-relaxed">
              {problem.question}
            </p>
          </div>

          {/* STEP 1: UNDERSTANDING */}
          {pedagogyStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">Identifikasi Diketahui &amp; Ditanya:</span>
                <div className="space-y-2">
                  {problem.pedagogy.diketahui.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-2 mt-2 text-xs md:text-sm text-slate-200 font-medium">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Ditanya:</span>
                    {problem.pedagogy.ditanya}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPedagogyStep(2)}
                className="w-full py-4 bg-cyan-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
              >
                Pahami &amp; Buat Model Matematika
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: MATHEMATICAL MODELING */}
          {pedagogyStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilih Model Matematika yang Tepat:</span>
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
                          ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
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
                  className="w-full py-4 bg-cyan-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
                >
                  Verifikasi Model Matematika
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {isModelCorrect === false && (
                <div className="bg-red-950/40 text-red-300 p-3.5 rounded-xl border border-red-900/60 text-xs flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isModelCorrect === true && (
                <div className="bg-emerald-950/40 text-emerald-300 p-3.5 rounded-xl border border-emerald-900/60 text-xs flex items-start gap-2 animate-pulse">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hebat! Model matematika tepat. Mengalihkan ke simulator lintasan...</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SOLVING IN ACTIVE MODULE */}
          {pedagogyStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-900/40 text-xs md:text-sm space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Simulator Target:</span>
                <p className="text-slate-300 leading-relaxed">
                  Gerakkan mobil balap ke posisi tujuan akhir yang benar: <strong className="text-cyan-400 text-base">{problem.targetPos}</strong>
                </p>
                <div className="text-xs text-slate-500 leading-normal">
                  Gunakan tombol kendali di panel simulator sebelah kanan untuk memutar kemudi dan menjalankan roda mobil!
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCarPos(problem.startPos);
                    setCarFacing('right');
                    setErrorMessage('');
                  }}
                  className="px-4 py-3 bg-slate-800 border border-slate-750 rounded-xl hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Posisi
                </button>
                <button
                  onClick={handleVerifyPosition}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow text-xs flex items-center justify-center gap-1 active:translate-y-1 cursor-pointer"
                >
                  Verifikasi Hasil Garis Bilangan ✓
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

          {/* STEP 4: VERIFICATION & SUMMARY */}
          {pedagogyStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-950/40 text-emerald-300 p-5 rounded-2xl border border-emerald-900/60 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Langkah Selesai &amp; Terverifikasi!
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {problem.pedagogy.explanation}
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/40 text-xs font-semibold">
                  Kesimpulan: Hasil dari {problem.pedagogy.correctModel} adalah {problem.targetPos}.
                </div>
              </div>

              <button
                onClick={handleNextLevel}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black tracking-widest uppercase rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
              >
                {currentLevelIdx < PROBLEMS.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesaikan Tantangan & Simpan Skor!'}
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Display (Number Line Sandbox) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-8 shadow-2xl relative min-h-[450px] flex flex-col justify-between overflow-hidden">
          {/* Top colored aesthetic bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500"></div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-900/40">
                Papan Simulasi 1D Koordinat (4K Optimized)
              </span>
              <div className="text-xs font-mono text-slate-500">
                Status: <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
            </div>

            {/* Simulated Track/Ground */}
            <div className="relative pt-24 pb-16 bg-slate-950 rounded-2xl border border-slate-850 px-6 overflow-hidden">
              {/* Scale Line */}
              <div className="h-1.5 bg-cyan-950 w-full relative rounded-full border border-cyan-900/20">
                {/* Visual points */}
                <div className="absolute inset-0 flex justify-between px-2">
                  {linePoints.map((val) => {
                    const isZero = val === 0;
                    const isTarget = val === problem.targetPos;
                    const isCurrent = val === carPos;
                    
                    return (
                      <div key={val} className="relative flex flex-col items-center">
                        {/* Tick mark */}
                        <div className={`w-0.5 h-3 ${isZero ? 'h-5 bg-cyan-400 w-1' : isTarget ? 'bg-amber-400 w-0.5' : 'bg-slate-850'}`}></div>
                        {/* Number label */}
                        <span className={`absolute top-4 text-[10px] font-mono font-black tracking-tighter ${
                          isCurrent ? 'text-cyan-400 text-xs scale-110 font-black' : isZero ? 'text-cyan-400 font-bold' : isTarget ? 'text-amber-400 font-black' : 'text-slate-700'
                        }`}>
                          {val}
                        </span>
                        
                        {/* Target Highlight Ring */}
                        {isTarget && (
                          <span className="absolute -top-12 w-6 h-6 rounded-full border-2 border-amber-400 animate-ping opacity-60"></span>
                        )}
                        {isTarget && (
                          <span className="absolute -top-12 text-[9px] text-slate-950 font-black uppercase tracking-wider bg-amber-400 px-1 py-0.5 rounded border border-amber-300">
                            GOAL
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INTERACTIVE CAR CONTAINER */}
              {/* Calculate exact offset percentage for car movement */}
              {(() => {
                const percentage = ((carPos + 10) / 20) * 100;
                return (
                  <div
                    className="absolute -top-4 transition-all duration-700 ease-out flex flex-col items-center"
                    style={{
                      left: `calc(${percentage}% - 32px)`,
                    }}
                  >
                    {/* Car Facing Indicator Bubble */}
                    <div className="bg-cyan-500 text-slate-950 font-mono text-[9px] font-black px-2 py-0.5 rounded mb-1 flex items-center gap-1 shadow">
                      {carFacing === 'right' ? '➔ Kanan' : '← Kiri'} ({carPos})
                    </div>
                    {/* Car Icon */}
                    <div className={`transition-transform duration-500 p-2.5 bg-slate-900 border-2 border-cyan-500 rounded-full text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] ${
                      carFacing === 'left' ? '-scale-x-100' : ''
                    }`}>
                      <Car className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Hands-on physical controllers for large screen touches */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Alat Pengendali Mobil Balap (Tactile Classroom Interface):
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Facing control */}
              <button
                onClick={toggleFacing}
                className="py-4 px-4 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 rounded-xl font-black text-xs uppercase tracking-wider active:translate-y-1 transition-all cursor-pointer"
                id="btn-car-reverse"
              >
                <RefreshCw className="w-4.5 h-4.5 text-cyan-400" />
                Ubah Hadap ({carFacing === 'right' ? 'Hadap Kiri' : 'Hadap Kanan'})
              </button>

              {/* Step Right / Forward */}
              <button
                onClick={() => moveCar(carFacing === 'right' ? 1 : -1)}
                className="py-4 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider active:translate-y-1 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                id="btn-car-forward"
              >
                Maju 1 Langkah (+1)
              </button>

              {/* Step Left / Backward */}
              <button
                onClick={() => moveCar(carFacing === 'right' ? -1 : 1)}
                className="py-4 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-black text-xs uppercase tracking-wider active:translate-y-1 border border-slate-700 transition-all cursor-pointer"
                id="btn-car-backward"
              >
                Mundur 1 Langkah (-1)
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-2">
              <span>* Maju: Melangkah searah moncong mobil.</span>
              <span>* Mundur: Melangkah berlawanan arah moncong mobil.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pedagogical Framework Footer */}
      <footer className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 1 
            ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' 
            : pedagogyStep === 1 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">1. Understand</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Identifikasi Diketahui &amp; Ditanya</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 2 
            ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' 
            : pedagogyStep === 2 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">2. Modeling</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Konstruksi Model Matematika</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 3 
            ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' 
            : pedagogyStep === 3 
            ? 'bg-cyan-950/80 border-cyan-800 ring-2 ring-cyan-400 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-900/60 border-slate-800 opacity-40 text-slate-600'
        }`}>
          <div className="text-[10px] uppercase font-black mb-1 tracking-widest">3. Solve</div>
          <div className="text-xs text-slate-200 leading-tight font-medium">Implementasi Strategi Solusi</div>
        </div>
        <div className={`p-4 rounded-xl flex flex-col items-center text-center border transition-all ${
          pedagogyStep > 4 
            ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' 
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
