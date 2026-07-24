import React, { useState, useEffect } from 'react';
import { SetProblem } from '../types';
import { Disc, CheckCircle, RefreshCw, AlertCircle, ArrowRight, HelpCircle, Info, Home } from 'lucide-react';

const PROBLEMS: SetProblem[] = [
  {
    id: 'set_1',
    level: 1,
    question: 'Di sebuah kelas, Himpunan A adalah siswa yang menyukai Apel {Apel, Jeruk, Mangga}. Himpunan B adalah siswa yang menyukai Jeruk {Jeruk, Pisang, Anggur}. Tentukan anggota dari IRISAN (A ∩ B) kedua himpunan tersebut!',
    universe: ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur', 'Buku', 'Pensil'],
    setA: ['Apel', 'Jeruk', 'Mangga'],
    setB: ['Jeruk', 'Pisang', 'Anggur'],
    operation: 'intersection',
    correctElements: ['Jeruk'],
    pedagogy: {
      diketahui: ['Himpunan S (Semesta) = {Apel, Jeruk, Mangga, Pisang, Anggur, Buku, Pensil}', 'Himpunan A (Suka Apel) = {Apel, Jeruk, Mangga}', 'Himpunan B (Suka Jeruk) = {Jeruk, Pisang, Anggur}'],
      ditanya: 'Irisan dari himpunan A dan B (A ∩ B) atau siswa yang menyukai keduanya.',
      correctModel: 'A ∩ B',
      modelOptions: ['A ∩ B', 'A ∪ B', 'A - B', 'A\''],
      explanation: 'Irisan (∩) dari dua himpunan melambangkan anggota yang sama-sama dimiliki oleh himpunan A dan himpunan B. Elemen yang sama adalah "Jeruk".'
    }
  },
  {
    id: 'set_2',
    level: 2,
    question: 'Berdasarkan data Himpunan A {Apel, Jeruk, Mangga} dan B {Jeruk, Pisang, Anggur}, tentukan anggota GABUNGAN (A ∪ B) dari kedua himpunan tersebut!',
    universe: ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur', 'Buku'],
    setA: ['Apel', 'Jeruk', 'Mangga'],
    setB: ['Jeruk', 'Pisang', 'Anggur'],
    operation: 'union',
    correctElements: ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur'],
    pedagogy: {
      diketahui: ['Himpunan S (Semesta) = {Apel, Jeruk, Mangga, Pisang, Anggur, Buku}', 'Himpunan A = {Apel, Jeruk, Mangga}', 'Himpunan B = {Jeruk, Pisang, Anggur}'],
      ditanya: 'Gabungan dari himpunan A dan B (A ∪ B) atau semua siswa yang suka salah satu atau keduanya.',
      correctModel: 'A ∪ B',
      modelOptions: ['A ∩ B', 'A ∪ B', 'A - B', 'B\''],
      explanation: 'Gabungan (∪) melambangkan semua anggota himpunan A digabungkan dengan semua anggota himpunan B. Anggota yang ganda ditulis satu kali saja.'
    }
  }
];

export default function VennMaster({ onScoreSaved, onBackToMenu }: { onScoreSaved: (score: number) => void; onBackToMenu: () => void }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pedagogyStep, setPedagogyStep] = useState<1 | 2 | 3 | 4>(1);

  const problem = PROBLEMS[currentLevelIdx];
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isModelCorrect, setIsModelCorrect] = useState<boolean | null>(null);
  
  // Placement State
  // Map element name to region: 'none' | 'a_only' | 'intersection' | 'b_only' | 'complement'
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Reset level states
    setSelectedModel(null);
    setIsModelCorrect(null);
    setSelectedItem(null);
    setErrorMessage('');
    setPedagogyStep(1);

    // Initialize all elements to 'none' position
    const initial: Record<string, string> = {};
    problem.universe.forEach((item) => {
      initial[item] = 'none';
    });
    setPlacements(initial);
  }, [currentLevelIdx]);

  const handleVerifyModel = () => {
    if (selectedModel === problem.pedagogy.correctModel) {
      setIsModelCorrect(true);
      setErrorMessage('');
      setTimeout(() => {
        setPedagogyStep(3);
      }, 1000);
    } else {
      setIsModelCorrect(false);
      setErrorMessage('Model himpunan kurang tepat. Perhatikan definisi operasionalnya!');
    }
  };

  const assignRegion = (region: 'a_only' | 'intersection' | 'b_only' | 'complement') => {
    if (!selectedItem) return;
    setPlacements((prev) => ({
      ...prev,
      [selectedItem]: region
    }));
    setSelectedItem(null);
    setErrorMessage('');
  };

  const handleVerifyPlacements = () => {
    let correct = true;
    
    // Check elements
    for (const item of problem.universe) {
      const region = placements[item];
      const inA = problem.setA.includes(item);
      const inB = problem.setB.includes(item);

      if (inA && inB) {
        if (region !== 'intersection') correct = false;
      } else if (inA) {
        if (region !== 'a_only') correct = false;
      } else if (inB) {
        if (region !== 'b_only') correct = false;
      } else {
        if (region !== 'complement') correct = false;
      }
    }

    if (correct) {
      setTotalScore((prev) => prev + 150);
      setPedagogyStep(4);
      setErrorMessage('');
    } else {
      setErrorMessage('Beberapa benda belum berada di kelompok lingkaran yang benar. Periksa kembali keanggotaannya!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < PROBLEMS.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
    } else {
      onScoreSaved(totalScore);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Topic: Himpunan</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5 font-display uppercase">
            <Disc className="w-7 h-7 text-emerald-400 animate-spin" />
            Venn Master Organizer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Level</span>
            <span className="text-lg font-black text-emerald-400">{problem.level} / {PROBLEMS.length}</span>
          </div>
          <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl text-center">
            <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Total Skor</span>
            <span className="text-lg font-black text-teal-400">{totalScore} Pts</span>
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
        {/* Left Side: Pedagogy Polya */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xxs font-extrabold text-slate-500 uppercase tracking-widest block">Tahapan Pemecahan Masalah (Polya)</span>
            <div className="flex justify-between mt-3 text-xs font-bold text-slate-400">
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 1 ? 'border-emerald-400 text-emerald-400 font-extrabold' : 'border-transparent'}`}>1. Pahami</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 2 ? 'border-emerald-400 text-emerald-400 font-extrabold' : 'border-transparent'}`}>2. Model</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 3 ? 'border-emerald-400 text-emerald-400 font-extrabold' : 'border-transparent'}`}>3. Selesaikan</span>
              <span className={`pb-1 border-b-2 transition-all ${pedagogyStep >= 4 ? 'border-emerald-400 text-emerald-400 font-extrabold' : 'border-transparent'}`}>4. Verifikasi</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
            <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Soal Kasus Himpunan:
            </h3>
            <p className="text-white font-bold text-sm md:text-base leading-relaxed">
              {problem.question}
            </p>
          </div>

          {/* STEP 1 */}
          {pedagogyStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Identifikasi Diketahui:</span>
                <div className="space-y-2 text-xs md:text-sm text-slate-300">
                  {problem.pedagogy.diketahui.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
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
                className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
              >
                Lanjut: Buat Notasi Himpunan
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {pedagogyStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilih Notasi Himpunan Operasi yang Benar:</span>
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
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200 shadow-sm'
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
                  className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 text-xs active:translate-y-1 cursor-pointer"
                >
                  Verifikasi Notasi Himpunan
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
              <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40 text-xs md:text-sm">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Panduan Pengelompokan:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Sentuh/Klik salah satu kata benda di kotak kuning semesta sebelah kanan, lalu tentukan letaknya dengan menyentuh salah satu wilayah lingkaran Venn.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const initial: Record<string, string> = {};
                    problem.universe.forEach((item) => {
                      initial[item] = 'none';
                    });
                    setPlacements(initial);
                    setSelectedItem(null);
                    setErrorMessage('');
                  }}
                  className="px-4 py-3 bg-slate-800 border border-slate-750 rounded-xl hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Diagram
                </button>
                <button
                  onClick={handleVerifyPlacements}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow text-xs flex items-center justify-center gap-1 active:translate-y-1 cursor-pointer"
                >
                  Verifikasi Letak Anggota ✓
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
                  Pengelompokan Sempurna!
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {problem.pedagogy.explanation}
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/40 text-xs font-semibold">
                  Maka anggota {problem.pedagogy.correctModel} adalah: <strong>{`{ ${problem.correctElements.join(', ')} }`}</strong>.
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

        {/* Right Side: Interactive Venn Board */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-6 shadow-2xl min-h-[480px] flex flex-col justify-between relative overflow-hidden">
          {/* Top colored aesthetic bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-900/40">
                Papan Diagram Venn Interaktif (70" Tablet Friendly)
              </span>
              <span className="text-xxs font-mono text-slate-500">Universe: {problem.universe.length} Items</span>
            </div>

            {/* Draggable/Tappable Items Warehouse (Semesta Himpunan S) */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-4 mb-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Semesta (S) - Ketuk benda lalu pilih lingkaran tujuan:</span>
              <div className="flex flex-wrap gap-2">
                {problem.universe.map((item) => {
                  const place = placements[item] || 'none';
                  const isPlaced = place !== 'none';
                  const isSelected = selectedItem === item;

                  return (
                    <button
                      key={item}
                      onClick={() => pedagogyStep === 3 && setSelectedItem(item)}
                      disabled={pedagogyStep !== 3}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.4)] border-2 border-white'
                          : isPlaced
                          ? 'bg-slate-900 text-slate-600 line-through opacity-30 border border-transparent'
                          : 'bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-800/60'
                      }`}
                    >
                      <span>{item}</span>
                      {isPlaced && <span className="text-[9px] font-mono text-slate-400">({place === 'a_only' ? 'A' : place === 'b_only' ? 'B' : place === 'intersection' ? 'A∩B' : 'Luar'})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Overlapping Venn Graphics */}
            <div className="relative h-[280px] bg-slate-950 rounded-2xl border border-slate-850 flex justify-center items-center overflow-hidden">
              {/* Outer Semesta label */}
              <div className="absolute top-4 left-4 text-xs font-bold font-mono text-slate-500">S (Semesta)</div>

              {/* Set A Circle */}
              <div className="absolute left-[15%] w-[200px] h-[200px] rounded-full border-2 border-blue-500/80 bg-blue-500/5 flex flex-col justify-start pt-6 px-4">
                <span className="text-blue-400 font-extrabold text-xs md:text-sm mb-1 block">A (Suka Apel)</span>
                {/* Render items currently placed in A Saja */}
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                  {Object.entries(placements)
                    .filter(([_, region]) => region === 'a_only')
                    .map(([item]) => (
                      <span key={item} className="bg-blue-900/60 border border-blue-500/40 text-blue-200 text-[10px] font-black px-1.5 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                </div>
              </div>

              {/* Set B Circle */}
              <div className="absolute right-[15%] w-[200px] h-[200px] rounded-full border-2 border-emerald-500/80 bg-emerald-500/5 flex flex-col items-end justify-start pt-6 px-4">
                <span className="text-emerald-400 font-extrabold text-xs md:text-sm mb-1 block">B (Suka Jeruk)</span>
                {/* Render items currently placed in B Saja */}
                <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                  {Object.entries(placements)
                    .filter(([_, region]) => region === 'b_only')
                    .map(([item]) => (
                      <span key={item} className="bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-[10px] font-black px-1.5 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                </div>
              </div>

              {/* Intersection overlapping target area */}
              <div className="absolute z-10 w-[100px] h-[140px] bg-slate-900/90 border border-dashed border-indigo-500/40 rounded-3xl flex flex-col items-center justify-center p-2 text-center shadow-lg">
                <span className="text-indigo-400 font-bold text-[10px]">Irisan (A ∩ B)</span>
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {Object.entries(placements)
                    .filter(([_, region]) => region === 'intersection')
                    .map(([item]) => (
                      <span key={item} className="bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-[10px] font-black px-1.5 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                </div>
              </div>

              {/* Complements outside circles */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1 justify-center border-t border-slate-900 pt-2 bg-slate-950/80 z-20">
                <span className="text-slate-500 text-[10px] font-mono">Benda di luar lingkaran (Komplemen):</span>
                {Object.entries(placements)
                  .filter(([_, region]) => region === 'complement')
                  .map(([item]) => (
                    <span key={item} className="bg-slate-900 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-800">
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Action Grid when item is active */}
          {selectedItem && (
            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Letakkan "{selectedItem}" ke wilayah:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => assignRegion('a_only')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                >
                  A Saja
                </button>
                <button
                  onClick={() => assignRegion('intersection')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Irisan (Tengah)
                </button>
                <button
                  onClick={() => assignRegion('b_only')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                >
                  B Saja
                </button>
                <button
                  onClick={() => assignRegion('complement')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-all border border-slate-700 cursor-pointer"
                >
                  Luar
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
