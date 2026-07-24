import React, { useState, useEffect } from 'react';
import { Score, Topic } from '../types';
import { Award, Trophy, Trash2, Search, Filter, Calendar, Users, Star, ArrowRight } from 'lucide-react';

interface LeaderboardProps {
  activeTopic?: Topic;
  onBack: () => void;
  onSaveNewScore?: (name: string, className: string, score: number) => void;
  pendingScore?: number | null; // if there is a newly completed game score waiting to be saved
  currentPlayer?: { name: string, className: string } | null;
}

const DEFAULT_SCORES: Score[] = [
  { id: '1', studentName: 'Andi Pratama', className: '7-A', topic: 'integers', score: 300, timeSpent: 120, timestamp: '2026-07-12' },
  { id: '2', studentName: 'Rina Wijaya', className: '7-B', topic: 'sets', score: 250, timeSpent: 180, timestamp: '2026-07-12' },
  { id: '3', studentName: 'Budi Santoso', className: '7-A', topic: 'equations', score: 240, timeSpent: 140, timestamp: '2026-07-11' },
  { id: '4', studentName: 'Siti Aminah', className: '7-C', topic: 'integers', score: 200, timeSpent: 160, timestamp: '2026-07-10' }
];

export default function Leaderboard({ activeTopic, onBack, onSaveNewScore, pendingScore, currentPlayer }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<Topic | 'all'>('all');
  
  // Form values for saving a new pending score
  const [studentName, setStudentName] = useState(currentPlayer?.name || '');
  const [classNameInput, setClassNameInput] = useState(currentPlayer?.className || '7-A');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (currentPlayer) {
      setStudentName(currentPlayer.name);
      setClassNameInput(currentPlayer.className);
    }
  }, [currentPlayer]);

  useEffect(() => {
    // Load high scores from LocalStorage, fall back to default scores
    const stored = localStorage.getItem('math_playground_scores');
    if (stored) {
      setScores(JSON.parse(stored));
    } else {
      setScores(DEFAULT_SCORES);
      localStorage.setItem('math_playground_scores', JSON.stringify(DEFAULT_SCORES));
    }
  }, []);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || pendingScore === null || pendingScore === undefined) return;

    const newScoreItem: Score = {
      id: Math.random().toString(),
      studentName: studentName.trim(),
      className: classNameInput,
      topic: activeTopic || 'integers',
      score: pendingScore,
      timeSpent: 90, // mock duration
      timestamp: new Date().toISOString().split('T')[0]
    };

    const updated = [newScoreItem, ...scores];
    setScores(updated);
    localStorage.setItem('math_playground_scores', JSON.stringify(updated));
    setHasSaved(true);

    if (onSaveNewScore) {
      onSaveNewScore(studentName, classNameInput, pendingScore);
    }
  };

  const handleResetScores = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat papan skor kelas?')) {
      setScores([]);
      localStorage.removeItem('math_playground_scores');
    }
  };

  // Filtering logic
  const filteredScores = scores
    .filter((s) => {
      const matchSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || s.className.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = selectedTopicFilter === 'all' ? true : s.topic === selectedTopicFilter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => b.score - a.score); // Highest score first

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in text-slate-100">
      {/* Navigation */}
      <button
        onClick={onBack}
        className="text-sm font-semibold text-slate-400 hover:text-white mb-6 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
      >
        ← Kembali ke Panel Utama
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* NEW SCORE SAVE FORM (Conditional on completed game) */}
        {pendingScore !== null && pendingScore !== undefined && !hasSaved && (
          <div className="lg:col-span-12 bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-900/60 p-6 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
            {/* Aesthetic top glowing line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>

            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              <div>
                <h2 className="text-xl font-extrabold text-white font-display uppercase tracking-wider">Selamat! Simulasi Selesai!</h2>
                <p className="text-slate-300 text-sm">Anda mengumpulkan skor <strong className="text-amber-400 text-base">{pendingScore} Pts</strong>. Daftarkan nama Anda di papan kelas!</p>
              </div>
            </div>

            <form onSubmit={handleSaveScore} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1 w-full">
                <label className="text-xxs font-bold text-slate-400 uppercase block tracking-wider">Nama Lengkap Siswa:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="w-full px-4 py-3 border border-slate-800 bg-slate-950 rounded-xl focus:border-amber-500 focus:outline-none text-sm font-semibold text-white"
                />
              </div>

              <div className="w-full sm:w-32 space-y-1">
                <label className="text-xxs font-bold text-slate-400 uppercase block tracking-wider">Kelas:</label>
                <select
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-800 bg-slate-950 rounded-xl focus:border-amber-500 focus:outline-none text-sm font-bold text-slate-300"
                >
                  <option value="7-A">Kelas 7-A</option>
                  <option value="7-B">Kelas 7-B</option>
                  <option value="7-C">Kelas 7-C</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-widest uppercase rounded-xl text-xs transition-all active:translate-y-1 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                Simpan Skor <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* HIGH SCORES DASHBOARD LIST */}
        <div className="lg:col-span-12 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-slate-950 p-6 text-white flex justify-between items-center relative">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

            <div className="flex items-center gap-2.5">
              <Award className="w-8 h-8 text-white animate-pulse" />
              <div>
                <h1 className="text-2xl font-black tracking-tight font-display uppercase">Papan Skor Siswa Teratas</h1>
                <p className="text-amber-200 text-xs">Peringkat performa simulasi pemecahan masalah matematika.</p>
              </div>
            </div>
            <button
              onClick={handleResetScores}
              className="p-2 hover:bg-white/10 rounded-lg text-amber-200 hover:text-white transition-all active:scale-95 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Reset Papan Skor"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          </div>

          {/* Filtering and search rails */}
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/40">
            {/* Search box */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-3.5 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari nama / kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-800 bg-slate-950 rounded-xl focus:border-amber-500 focus:outline-none text-xs font-semibold text-white"
              />
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-500">
                <Filter className="w-4 h-4" />
              </span>
              <div className="flex gap-1 bg-slate-950 border border-slate-805 rounded-lg p-0.5 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedTopicFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    selectedTopicFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedTopicFilter('integers')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    selectedTopicFilter === 'integers' ? 'bg-cyan-950 border border-cyan-800/40 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Bil. Bulat
                </button>
                <button
                  onClick={() => setSelectedTopicFilter('sets')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    selectedTopicFilter === 'sets' ? 'bg-emerald-950 border border-emerald-800/40 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Himpunan
                </button>
                <button
                  onClick={() => setSelectedTopicFilter('equations')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    selectedTopicFilter === 'equations' ? 'bg-amber-950 border border-amber-800/40 text-amber-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  SPLSV
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-4">Nama Siswa / Kelas</th>
                  <th className="py-4 px-4">Topik Simulasi</th>
                  <th className="py-4 px-4 text-right">Tanggal</th>
                  <th className="py-4 px-6 text-right">Skor Terkumpul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm">
                {filteredScores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium bg-slate-950/20">
                      Papan skor kosong atau tidak ditemukan nama yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredScores.map((score, idx) => {
                    const rankStyles = [
                      'bg-amber-950/80 text-amber-400 border-amber-800/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
                      'bg-slate-800 text-slate-300 border-slate-700',
                      'bg-orange-950/80 text-orange-400 border-orange-800/60'
                    ][idx] || 'bg-slate-950 text-slate-500 border-slate-850';

                    return (
                      <tr key={score.id} className="hover:bg-slate-950/30 transition-colors">
                        <td className="py-4 px-6 text-center">
                          <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-black mx-auto text-xs ${rankStyles}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{score.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase">Kelas {score.className}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            score.topic === 'integers'
                              ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40'
                              : score.topic === 'sets'
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                              : 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                          }`}>
                            {score.topic === 'integers' ? 'Bilangan Bulat' : score.topic === 'sets' ? 'Himpunan' : 'SPLSV'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-xs text-slate-500 font-mono">
                          {score.timestamp}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-mono text-base font-black text-amber-400 flex items-center justify-end gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
                            {score.score}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
