import React, { useState } from 'react';
import { Topic, Student } from '../types';
import { Target, CheckCircle2, ChevronRight, GraduationCap, Users, User, AlertCircle } from 'lucide-react';

interface LearningObjectivesProps {
  topic: Topic;
  onStart: () => void;
  onBack: () => void;
  students: Student[];
  currentPlayer: Student | null;
  onSelectPlayer: (student: Student | null) => void;
}

export default function LearningObjectives({ 
  topic, 
  onStart, 
  onBack, 
  students = [], 
  currentPlayer, 
  onSelectPlayer 
}: LearningObjectivesProps) {
  const [checkedStates, setCheckedStates] = useState<boolean[]>([false, false, false]);

  const data = {
    integers: {
      topicTitle: 'Bilangan Bulat (Integers)',
      subTitle: 'Integer Race Simulator',
      kompetensiDasar: '3.2 Menjelaskan dan melakukan operasi hitung bilangan bulat dan pecahan dengan memanfaatkan berbagai sifat operasi.',
      indicators: [
        'IPK 1: Menganalisis operasi penjumlahan bilangan bulat menggunakan arah panah dan posisi laju mobil di garis bilangan.',
        'IPK 2: Menganalisis operasi pengurangan bilangan bulat dengan konsep pembalikan arah pergerakan laju mobil.',
        'IPK 3: Mengaitkan pemodelan visual pergerakan maju-mundur dengan model matematika formal.'
      ],
      description: 'Pada petualangan kali ini, kamu akan mengendarai mobil balap pintar di sepanjang garis bilangan. Ingat prinsip dasar: Penjumlahan (+) berarti mobil menghadap arah yang sama, Pengurangan (-) berarti mobil berbalik arah. Bilangan positif (+) berarti melangkah maju, dan bilangan negatif (-) berarti melangkah mundur.'
    },
    sets: {
      topicTitle: 'Himpunan (Sets)',
      subTitle: 'Venn Master Organizer',
      kompetensiDasar: '3.4 Menjelaskan himpunan, himpunan bagian, himpunan semesta, himpunan kosong, komplemen himpunan, dan melakukan operasi biner pada himpunan menggunakan masalah kontekstual.',
      indicators: [
        'IPK 1: Mengidentifikasi anggota dari masing-masing himpunan lingkaran A dan himpunan lingkaran B.',
        'IPK 2: Mengonstruksikan irisan (A ∩ B) dan gabungan (A ∪ B) dari dua kelompok objek digital.',
        'IPK 3: Menentukan komplemen himpunan dari objek yang berada di luar batas lingkaran namun masih dalam semesta.'
      ],
      description: 'Kamu adalah penjaga gerbang diagram Venn! Tugasmu adalah menyeret (drag) berbagai buah dan benda matematika ke posisi yang tepat. Apakah benda tersebut milik himpunan A saja, B saja, irisan keduanya, atau berada di luar lingkaran (komplemen)?'
    },
    equations: {
      topicTitle: 'Persamaan Linear Satu Variabel',
      subTitle: 'Equation Balancer Scale',
      kompetensiDasar: '3.6 Menjelaskan persamaan dan pertidaksamaan linear satu variabel dan penyelesaiannya.',
      indicators: [
        'IPK 1: Menerjemahkan kalimat cerita matematika ke dalam model persamaan linear x + a = b.',
        'IPK 2: Menyederhanakan persamaan dengan menambah atau mengurangi beban di kedua sisi timbangan secara seimbang.',
        'IPK 3: Menemukan nilai akhir x yang tepat dengan membagi atau memisahkan berat timbangan secara merata.'
      ],
      description: 'Selamat datang di laboratorium neraca seimbang! Timbangan digital ini merepresentasikan persamaan matematika. Agar seimbang, apa pun yang kamu lakukan di lengan kiri (tambah/kurang beban) harus kamu lakukan juga di lengan kanan. Cari tahu berat kotak misterius x!'
    }
  }[topic];

  const toggleCheck = (idx: number) => {
    const updated = [...checkedStates];
    updated[idx] = !updated[idx];
    setCheckedStates(updated);
  };

  const isAllChecked = checkedStates.every(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in text-slate-100">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm font-semibold text-slate-400 hover:text-white mb-6 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
      >
        ← Kembali ke Menu Utama
      </button>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white relative border-b border-slate-850">
          <div className="absolute right-6 bottom-6 opacity-5">
            <GraduationCap className="w-36 h-36" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-3 py-1 rounded-full">
            {data.subTitle}
          </span>
          <h1 className="text-3xl md:text-4xl font-black mt-4 tracking-tight font-display uppercase">
            Indikator Capaian Belajar
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
            {data.topicTitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          {/* Kompetensi Dasar */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
            <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Kompetensi Dasar (Kurikulum Merdeka)
            </h3>
            <p className="text-slate-200 font-medium text-sm leading-relaxed">
              {data.kompetensiDasar}
            </p>
          </div>

          {/* Interactive Checklist Indicators */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">
              Sentuh Tiap Indikator untuk Membaca Target:
            </h3>
            {data.indicators.map((indicator, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  checkedStates[idx]
                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'border-slate-850 hover:border-slate-800 bg-slate-950 text-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2
                    className={`w-6 h-6 transition-colors ${
                      checkedStates[idx] ? 'text-cyan-400 fill-cyan-950/80' : 'text-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-relaxed">
                    {indicator}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Game Description */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-850">
            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">
              Panduan Bermain &amp; Simulasi:
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* PLAYER SELECTION PANEL */}
          <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-850 space-y-4">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4.5 h-4.5" />
              Identitas Pemain (Pilih Siswa yang Bermain):
            </h4>

            {students.length === 0 ? (
              // Case A: No roster uploaded yet - manual entry
              <div className="space-y-3">
                <div className="bg-amber-950/20 border border-amber-900/40 text-amber-300 p-3.5 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Roster siswa belum diunggah. Silakan ketik nama lengkap Anda secara manual untuk mencatat skor ke leaderboard.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Lengkap Siswa:</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap siswa..."
                      value={currentPlayer?.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        onSelectPlayer(name ? { id: 'temp-guest', name, className: currentPlayer?.className || 'Kelas VII' } : null);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kelas:</label>
                    <select
                      value={currentPlayer?.className || 'Kelas VII'}
                      onChange={(e) => {
                        const className = e.target.value;
                        onSelectPlayer({ id: 'temp-guest', name: currentPlayer?.name || 'Siswa Tamu', className });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Kelas VII">Kelas VII</option>
                      <option value="7-A">Kelas 7-A</option>
                      <option value="7-B">Kelas 7-B</option>
                      <option value="7-C">Kelas 7-C</option>
                      <option value="7-D">Kelas 7-D</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // Case B: Roster uploaded - interactive picker
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Student Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pilih Siswa dari Roster:</label>
                    <select
                      value={currentPlayer ? `${currentPlayer.id}` : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          onSelectPlayer(null);
                        } else if (val === 'new-guest') {
                          onSelectPlayer({ id: 'temp-guest', name: 'Siswa Tamu', className: 'Kelas VII' });
                        } else {
                          const found = students.find(s => s.id === val);
                          if (found) onSelectPlayer(found);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Silakan Pilih Siswa --</option>
                      {/* Grouped by Class */}
                      {Array.from(new Set(students.map(s => s.className))).map(className => (
                        <optgroup key={className} label={`Roster ${className}`} className="bg-slate-950 text-slate-300 font-bold">
                          {students.filter(s => s.className === className).map(student => (
                            <option key={student.id} value={student.id} className="bg-slate-900 text-white font-normal">
                              {student.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="new-guest" className="text-cyan-400 font-semibold">-- Siswa Tamu (Tulis Manual) --</option>
                    </select>
                  </div>

                  {/* Search Roster Input */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cari Nama Cepat:</label>
                    <input
                      type="text"
                      placeholder="Ketik sebagian nama untuk mencari..."
                      onChange={(e) => {
                        const term = e.target.value.toLowerCase();
                        if (term) {
                          const matched = students.find(s => s.name.toLowerCase().includes(term));
                          if (matched) onSelectPlayer(matched);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* If selected Student is Guest / manual */}
                {currentPlayer?.id === 'temp-guest' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Siswa Tamu:</label>
                      <input
                        type="text"
                        placeholder="Ketik nama Anda..."
                        value={currentPlayer.name === 'Siswa Tamu' ? '' : currentPlayer.name}
                        onChange={(e) => onSelectPlayer({ id: 'temp-guest', name: e.target.value, className: currentPlayer.className })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kelas Siswa Tamu:</label>
                      <select
                        value={currentPlayer.className}
                        onChange={(e) => onSelectPlayer({ id: 'temp-guest', name: currentPlayer.name, className: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Kelas VII">Kelas VII</option>
                        <option value="7-A">Kelas 7-A</option>
                        <option value="7-B">Kelas 7-B</option>
                        <option value="7-C">Kelas 7-C</option>
                        <option value="7-D">Kelas 7-D</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Display Current Player Active Badge */}
                {currentPlayer && (
                  <div className="bg-cyan-950/20 border border-cyan-800/40 p-3 rounded-xl flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                      <span className="text-xs text-slate-400">Pemain Terpilih:</span>
                      <strong className="text-sm text-cyan-400">{currentPlayer.name}</strong>
                      <span className="text-xxs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{currentPlayer.className}</span>
                    </div>
                    <button
                      onClick={() => onSelectPlayer(null)}
                      className="text-xxs text-red-400 hover:text-red-300 font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Batal Pilih
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-850">
            <div className="text-xs font-semibold">
              {!isAllChecked ? (
                <span className="text-amber-500 font-bold">➔ Silakan baca &amp; centang semua indikator di atas</span>
              ) : !currentPlayer || !currentPlayer.name.trim() || currentPlayer.name === 'Siswa Tamu' ? (
                <span className="text-amber-400 font-bold">➔ Harap pilih siswa atau ketik nama lengkap Anda di panel identitas di atas</span>
              ) : (
                <span className="text-emerald-400 font-bold">✓ Semua indikator disetujui &amp; Pemain siap!</span>
              )}
            </div>

            <button
              onClick={onStart}
              disabled={!isAllChecked || !currentPlayer || !currentPlayer.name.trim() || currentPlayer.name === 'Siswa Tamu'}
              className={`w-full md:w-auto px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:translate-y-1 cursor-pointer ${
                (isAllChecked && currentPlayer && currentPlayer.name.trim() && currentPlayer.name !== 'Siswa Tamu')
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
              }`}
              id="btn-start-game-module"
            >
              Mulai Petualangan Matematika
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
