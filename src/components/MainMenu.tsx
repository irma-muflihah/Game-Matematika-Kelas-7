import React, { useState } from 'react';
import { Topic, Student } from '../types';
import { Hash, Disc, Scale, Award, FileText, Cpu, CheckCircle, Upload, Trash2, Plus, Users, FileSpreadsheet, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MainMenuProps {
  onSelectTopic: (topic: Topic) => void;
  onViewLeaderboard: () => void;
  onViewArchitecture: () => void;
  students: Student[];
  onStudentsChange: (students: Student[]) => void;
}

export default function MainMenu({ onSelectTopic, onViewLeaderboard, onViewArchitecture, students, onStudentsChange }: MainMenuProps) {
  const topics = [
    {
      id: 'integers' as Topic,
      title: 'Bilangan Bulat (Integers)',
      subTitle: 'Integer Race',
      description: 'Balapan di garis bilangan interaktif dengan operasi penjumlahan dan pengurangan menggunakan logika maju/mundur.',
      icon: Hash,
      color: 'from-blue-500 to-indigo-600',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      indicators: [
        'Memahami konsep bilangan bulat positif dan negatif',
        'Menyelesaikan operasi penjumlahan dan pengurangan bilangan bulat',
        'Merepresentasikan pergerakan pada garis bilangan interaktif'
      ]
    },
    {
      id: 'sets' as Topic,
      title: 'Himpunan (Sets)',
      subTitle: 'Venn Master',
      description: 'Urutkan dan kelompokkan elemen ke dalam diagram Venn berdasarkan operasi Irisan (Intersection), Gabungan (Union), dan Komplemen.',
      icon: Disc,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      indicators: [
        'Memahami pengertian himpunan dan semesta',
        'Mengelompokkan anggota ke dalam himpunan A, B, atau keduanya',
        'Menentukan hasil Irisan, Gabungan, dan Komplemen'
      ]
    },
    {
      id: 'equations' as Topic,
      title: 'Persamaan Linear Satu Variabel (SPLSV)',
      subTitle: 'Equation Balancer',
      description: 'Tyeimbangkan neraca digital dengan menggunakan operasi invers (tambah/kurang beban) untuk memecahkan nilai variabel x.',
      icon: Scale,
      color: 'from-amber-500 to-orange-600',
      shadowColor: 'rgba(245, 158, 11, 0.3)',
      indicators: [
        'Memahami konsep persamaan linier satu variabel (SPLSV)',
        'Menerapkan operasi penjumlahan/pengurangan di kedua ruas neraca',
        'Menemukan nilai solusi variabel x yang membuat timbangan seimbang'
      ]
    }
  ];

  const [dragActive, setDragActive] = useState(false);
  const [manualNames, setManualNames] = useState('');
  const [manualClass, setManualClass] = useState('7-A');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleExcelUpload = (file: File) => {
    setUploadError('');
    setUploadSuccess('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          setUploadError('Gagal membaca file.');
          return;
        }
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        if (json.length === 0) {
          setUploadError('Excel kosong atau tidak dapat dibaca.');
          return;
        }

        const parsed: Student[] = [];
        json.forEach((row, index) => {
          const keys = Object.keys(row);
          const nameKey = keys.find(k => 
            k.toLowerCase().includes('nama') || 
            k.toLowerCase().includes('name') || 
            k.toLowerCase().includes('siswa') || 
            k.toLowerCase().includes('murid')
          ) || keys[0];

          const classKey = keys.find(k => 
            k.toLowerCase().includes('kelas') || 
            k.toLowerCase().includes('class')
          );

          const nameVal = nameKey ? row[nameKey] : '';
          const classVal = classKey ? row[classKey] : '7-A';

          if (nameVal && String(nameVal).trim()) {
            parsed.push({
              id: `st-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
              name: String(nameVal).trim(),
              className: String(classVal).trim()
            });
          }
        });

        if (parsed.length === 0) {
          setUploadError('Tidak ditemukan nama murid yang valid di file Excel.');
        } else {
          const updated = [...students, ...parsed];
          onStudentsChange(updated);
          setUploadSuccess(`Berhasil mengunggah ${parsed.length} nama murid dari Excel!`);
        }
      } catch (err) {
        setUploadError('Gagal memproses file Excel. Pastikan format file sesuai.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleExcelUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleExcelUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');
    if (!manualNames.trim()) return;

    const names = manualNames.split('\n').map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return;

    const newStudents: Student[] = names.map((name, idx) => ({
      id: `st-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      className: manualClass
    }));

    onStudentsChange([...students, ...newStudents]);
    setManualNames('');
    setUploadSuccess(`Berhasil menambahkan ${newStudents.length} murid secara manual.`);
  };

  const handleDeleteStudent = (id: string) => {
    onStudentsChange(students.filter(s => s.id !== id));
  };

  const handleClearRoster = () => {
    if (window.confirm('Hapus seluruh daftar murid?')) {
      onStudentsChange([]);
      setUploadSuccess('');
      setUploadError('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in text-slate-100">
      {/* Hero Header Section */}
      <div className="text-center mb-12">
        <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase">
          Interactive Math Classroom Panel
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-4 leading-none uppercase font-display">
          MATH PLAYGROUND <span className="text-cyan-500 font-medium">70"</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
          Aplikasi edukasi interaktif untuk pembelajaran matematika kelas VII berdasarkan model pemecahan masalah (Polya).
        </p>
      </div>

      {/* Grid of Main Topic Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {topics.map((topic) => {
          const IconComponent = topic.icon;
          
          // Custom tag/badge colors per topic for geometric alignment
          const accentColor = topic.id === 'integers' ? 'text-cyan-400' : topic.id === 'sets' ? 'text-emerald-400' : 'text-amber-400';
          const shadowStyle = topic.id === 'integers' 
            ? 'shadow-[0_15px_30px_rgba(6,182,212,0.15)]' 
            : topic.id === 'sets' 
            ? 'shadow-[0_15px_30px_rgba(16,185,129,0.15)]' 
            : 'shadow-[0_15px_30px_rgba(245,158,11,0.15)]';

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden cursor-pointer hover:-translate-y-2 hover:border-slate-750 transition-all duration-300 flex flex-col justify-between group active:scale-95 ${shadowStyle}`}
              id={`topic-card-${topic.id}`}
            >
              <div className="p-8">
                {/* Header Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-slate-950 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{topic.subTitle}</h3>
                <h2 className="text-xl font-extrabold text-white leading-tight group-hover:text-cyan-400 transition-colors font-display">
                  {topic.title}
                </h2>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  {topic.description}
                </p>

                {/* Indicators Checklist */}
                <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Indikator Kompetensi:</span>
                  {topic.indicators.map((ind, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-normal">
                      <span className={`text-base shrink-0 leading-none ${accentColor}`}>•</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Tap Trigger */}
              <div className={`p-4 bg-gradient-to-r ${topic.color} text-center text-slate-950 font-black tracking-widest text-xs uppercase group-hover:opacity-95 transition-opacity`}>
                Mulai Simulasi Interaktif ➔
              </div>
            </div>
          );
        })}
      </div>

      {/* KELOLA ROSTER SISWA PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
        {/* Top visual strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Kelola Roster Murid</h2>
              <p className="text-slate-400 text-xs">Unggah nama siswa dari file Excel (.xlsx) atau tambahkan secara manual untuk memilih pemain sebelum simulasi.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="font-bold text-slate-500">Total Murid Terdaftar:</span>
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black text-xs">
              {students.length}
            </span>
          </div>
        </div>

        {/* Form and Uploaders Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: File Uploader & Manual Entry */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Drag & Drop Excel Uploader */}
            <div className="space-y-2">
              <label className="text-xxs font-black text-slate-400 uppercase tracking-wider block">1. Unggah File Excel (.xlsx / .xls)</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative group flex flex-col items-center justify-center cursor-pointer ${
                  dragActive 
                    ? 'border-emerald-400 bg-emerald-950/20' 
                    : 'border-slate-800 hover:border-slate-750 bg-slate-950'
                }`}
              >
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileSpreadsheet className={`w-10 h-10 mb-3 transition-transform group-hover:scale-110 ${dragActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <p className="text-xs font-bold text-slate-200">
                  Seret &amp; letakkan file Excel di sini, atau <span className="text-emerald-400 underline">Cari File</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Mendukung file .xlsx dan .xls. Otomatis membaca kolom "Nama" dan "Kelas"</p>
              </div>
            </div>

            {/* 2. Manual Student Adder Fallback */}
            <form onSubmit={handleAddManual} className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <label className="text-xxs font-black text-slate-400 uppercase tracking-wider block">2. Atau Tambah Murid Manual (Alternatif)</label>
              
              <div className="space-y-2">
                <textarea
                  value={manualNames}
                  onChange={(e) => setManualNames(e.target.value)}
                  placeholder="Tulis atau tempel daftar nama murid di sini&#10;(Satu baris untuk satu nama, contoh:&#10;Ahmad Subarjo&#10;Budi Santoso&#10;Clara Sinta)"
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pilih Kelas:</label>
                  <select
                    value={manualClass}
                    onChange={(e) => setManualClass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kelas VII">Kelas VII</option>
                    <option value="7-A">Kelas 7-A</option>
                    <option value="7-B">Kelas 7-B</option>
                    <option value="7-C">Kelas 7-C</option>
                    <option value="7-D">Kelas 7-D</option>
                  </select>
                </div>
                <div className="pt-5">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Tambah Murid
                  </button>
                </div>
              </div>
            </form>

            {/* Notifications */}
            {uploadError && (
              <div className="bg-red-950/40 border border-red-900/60 text-red-300 p-4 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
            {uploadSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 p-4 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{uploadSuccess}</span>
              </div>
            )}

          </div>

          {/* Right Block: Active Roster Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 border border-slate-850 p-6 rounded-2xl min-h-[380px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-black text-slate-400 uppercase tracking-wider">Daftar Murid Terdaftar</span>
                {students.length > 0 && (
                  <button
                    onClick={handleClearRoster}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Bersihkan Roster
                  </button>
                )}
              </div>

              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate-600">
                  <Users className="w-12 h-12 mb-3 stroke-[1.5]" />
                  <p className="text-xs font-bold">Roster Siswa Kosong</p>
                  <p className="text-[10px] text-slate-600 max-w-xs mt-1">Silakan unggah roster dari Excel atau tambahkan secara manual untuk memulainya.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {/* Group students by className */}
                  {Array.from(new Set(students.map(s => s.className))).map(className => {
                    const classStudents = students.filter(s => s.className === className);
                    return (
                      <div key={className} className="space-y-2 border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          {className} ({classStudents.length} Siswa)
                        </h4>
                        <div className="flex flex-wrap gap-1.5 font-sans">
                          {classStudents.map(student => (
                            <div 
                              key={student.id} 
                              className="bg-slate-900 border border-slate-850 text-[11px] font-medium pl-2.5 pr-1 py-1 rounded-lg flex items-center gap-1 hover:border-slate-800 transition-all text-slate-300"
                            >
                              <span>{student.name}</span>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="w-4 h-4 rounded-md flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-all active:scale-90"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {students.length > 0 && (
              <p className="text-[9px] text-slate-600 italic mt-4 border-t border-slate-900 pt-3">
                * Roster ini disimpan secara otomatis di browser lokal Anda (LocalStorage) sehingga tidak akan terhapus saat berpindah halaman.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Auxiliary Controls for Classroom Setup */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Teacher Controls:</span>
        <button
          onClick={onViewLeaderboard}
          className="px-5 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          id="btn-main-leaderboard"
        >
          <Award className="w-4.5 h-4.5 text-amber-500" />
          Papan Skor Siswa (Leaderboard)
        </button>
        <button
          onClick={onViewArchitecture}
          className="px-5 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          id="btn-main-architecture"
        >
          <Cpu className="w-4.5 h-4.5 text-cyan-400" />
          Arsitektur &amp; Integrasi WS
        </button>
      </div>
    </div>
  );
}
