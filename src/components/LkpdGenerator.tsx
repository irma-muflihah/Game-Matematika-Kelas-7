import React, { useState } from 'react';
import { Topic } from '../types';
import { jsPDF } from 'jspdf';
import { FileText, Download, CheckCircle, Printer, Award, Info, AlertCircle } from 'lucide-react';

interface LkpdGeneratorProps {
  initialTopic?: Topic;
  onBack: () => void;
}

export default function LkpdGenerator({ initialTopic = 'integers', onBack }: LkpdGeneratorProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(initialTopic);
  const [schoolName, setSchoolName] = useState('SMPN 2 Kemranjen');
  const [className, setClassName] = useState('Kelas VII');
  const [teacherName, setTeacherName] = useState('Irma Muflihah, S.Pd.');
  const [semester, setSemester] = useState('Semester Ganjil');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const lkpdContent = {
    integers: {
      topicTitle: 'BILANGAN BULAT (OPERASI PENJUMLAHAN & PENGURANGAN)',
      ipk: [
        'Menganalisis pergerakan arah mobil pada garis bilangan.',
        'Mengonstruksi model penjumlahan dan pengurangan bilangan bulat.',
        'Menyimpulkan hasil akhir operasi secara mandiri.'
      ],
      problems: [
        {
          no: '1',
          text: 'Sebuah mobil mainan mula-mula berada di titik 2. Mobil tersebut kemudian bergerak MAJU sejauh 5 satuan. Tentukan posisi akhir mobil mainan tersebut!',
          hint: 'Gunakan simulator Integer Race untuk melihat lintasan mobil.'
        },
        {
          no: '2',
          text: 'Seekor katak berada di titik 3 pada garis bilangan. Katak berbalik arah (menghadap kiri) lalu melangkah maju sejauh 7 satuan. Di titik berapakah posisi katak sekarang?',
          hint: 'Ingat konsep pengurangan berarti balik arah!'
        }
      ]
    },
    sets: {
      topicTitle: 'HIMPUNAN & DIAGRAM VENN (IRISAN & GABUNGAN)',
      ipk: [
        'Mengelompokkan data ke dalam diagram Venn dua lingkaran.',
        'Menghitung irisan dan gabungan dari dua himpunan numerik.',
        'Menentukan nilai komplemen di luar himpunan lingkaran.'
      ],
      problems: [
        {
          no: '1',
          text: 'Kelompok A menyukai Apel {Apel, Jeruk, Mangga}. Kelompok B menyukai Jeruk {Jeruk, Pisang, Anggur}. Tentukan dan gambarlah irisan (A ∩ B) siswa yang menyukai keduanya!',
          hint: 'Gunakan simulator Venn Master untuk validasi penempatan buah.'
        },
        {
          no: '2',
          text: 'Berdasarkan data Kelompok A dan B di atas, tentukan anggota gabungan (A ∪ B) dari seluruh buah tersebut!',
          hint: 'Anggota yang sama cukup ditulis satu kali.'
        }
      ]
    },
    equations: {
      topicTitle: 'PERSAMAAN LINEAR SATU VARIABEL (SPLSV)',
      ipk: [
        'Menyusun model aljabar SPLSV dari masalah kontekstual timbangan.',
        'Mengisolasi nilai variabel x menggunakan metode keseimbangan neraca.',
        'Membuktikan kebenaran nilai solusi x.'
      ],
      problems: [
        {
          no: '1',
          text: 'Di lengan kiri timbangan terdapat 1 kotak misterius x dan 3 beban @1 kg. Di lengan kanan terdapat 7 beban @1 kg. Jika timbangan seimbang, tentukan berat kotak x!',
          hint: 'Gunakan simulator Equation Balancer untuk mengurangi beban secara merata.'
        },
        {
          no: '2',
          text: 'Selesaikan persamaan linear berikut menggunakan metode neraca seimbang: x + 5 = 9.',
          hint: 'Kurangi kedua lengan timbangan dengan beban 5 kg.'
        }
      ]
    }
  }[selectedTopic];

  const generatePDF = () => {
    setIsGenerating(true);
    setSuccessMsg('');

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- PAGE 1: TITLE & HEADER ---
      // School Kop (Kop Surat)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(schoolName.toUpperCase(), 105, 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN REPUBLIK INDONESIA', 105, 21, { align: 'center' });
      doc.text('Mata Pelajaran: Matematika (Fase D) | ' + semester, 105, 26, { align: 'center' });
      
      // Horizontal Double Line
      doc.setLineWidth(0.8);
      doc.line(15, 30, 195, 30);
      doc.setLineWidth(0.2);
      doc.line(15, 31.5, 195, 31.5);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59); // Charcoal blue
      doc.text('LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL', 105, 42, { align: 'center' });
      doc.setFontSize(11);
      doc.text(`TOPIK: ${lkpdContent.topicTitle}`, 105, 48, { align: 'center' });

      // Student metadata box (Empty boxes to fill in)
      doc.rect(15, 55, 180, 24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Kelompok / Nama Siswa :', 18, 61);
      doc.line(60, 61, 190, 61);
      
      doc.text('Kelas :', 18, 68);
      doc.text(className, 60, 68);
      doc.line(60, 69, 110, 69);
      
      doc.text('Hari / Tanggal :', 120, 68);
      doc.line(148, 69, 190, 69);
      
      doc.text('Guru Pengampu :', 18, 75);
      doc.text(teacherName, 60, 75);

      // Pedagogical Framework & IPK Header
      doc.setFillColor(241, 245, 249); // light slate gray
      doc.rect(15, 84, 180, 24, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229); // indigo
      doc.text('INDIKATOR PENCAPAIAN KOMPETENSI (IPK):', 18, 89);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      lkpdContent.ipk.forEach((val, index) => {
        doc.text(`- [  ] ${val}`, 20, 94 + (index * 4.5));
      });

      // Instructions Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PETUNJUK BELAJAR:', 15, 114);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('1. Bacalah soal cerita kontekstual dengan cermat.', 15, 119);
      doc.text('2. Jalankan simulasi pada Math Playground 70" di depan kelas untuk membuktikan jawaban.', 15, 123);
      doc.text('3. Isilah kotak "Diketahui, Ditanya, Model, Jawaban, & Kesimpulan" secara sistematis.', 15, 127);

      // PROBLEM 1
      const p1 = lkpdContent.problems[0];
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 134, 180, 150, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`SOAL TANTANGAN ${p1.no}:`, 18, 140);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const textLines1 = doc.splitTextToSize(p1.text, 172);
      doc.text(textLines1, 18, 145);

      // Structured boxes (Diketahui, Ditanya, Model, Jawaban, Kesimpulan)
      let boxY = 154;
      
      // Diketahui Box
      doc.setFillColor(255, 255, 255);
      doc.rect(18, boxY, 83, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('1. DIKETAHLUI (Knowns)', 21, boxY + 4.5);
      
      // Ditanya Box
      doc.rect(106, boxY, 83, 28);
      doc.text('2. DITANYA (Unknowns)', 109, boxY + 4.5);

      boxY += 31;
      // Model Matematika Box
      doc.rect(18, boxY, 171, 24);
      doc.text('3. MODEL MATEMATIKA (Mathematical Modeling)', 21, boxY + 4.5);

      boxY += 27;
      // Langkah Penyelesaian Box
      doc.rect(18, boxY, 171, 32);
      doc.text('4. STRATEGI & LANGKAH PENYELESAIAN (Solving Strategy)', 21, boxY + 4.5);

      boxY += 35;
      // Kesimpulan Box
      doc.rect(18, boxY, 171, 20);
      doc.text('5. KESIMPULAN & REFLEKSI (Verification & Conclusion)', 21, boxY + 4.5);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Math Playground - Printable LKPD Digital | Kurikulum Merdeka', 105, 290, { align: 'center' });

      // Save PDF
      doc.save(`LKPD_${selectedTopic}_${className.replace(' ', '_')}.pdf`);
      setSuccessMsg(`✓ File PDF LKPD untuk ${selectedTopic.toUpperCase()} berhasil diunduh!`);
    } catch (e: any) {
      console.error(e);
      alert('Gagal membuat PDF: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in text-slate-200">
      {/* Navigation */}
      <button
        onClick={onBack}
        className="text-sm font-semibold text-slate-400 hover:text-white mb-6 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
      >
        ← Kembali ke Panel Utama
      </button>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-8 text-white relative">
          {/* Top aesthetic color line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>
          <div className="absolute right-6 bottom-6 opacity-5">
            <FileText className="w-24 h-24" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full text-indigo-300">
            Worksheet Document Engine
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight font-display uppercase">
            Unduh Lembar Kerja Siswa (LKPD)
          </h1>
          <p className="text-slate-300 text-sm mt-1 leading-relaxed max-w-xl">
            Generate and print systematic Polya-problem-solving worksheets in standard A4 PDF format.
          </p>
        </div>

        {/* Configurations Form */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Topic Select */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Pilih Topik Pembelajaran:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['integers', 'sets', 'equations'] as Topic[]).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`py-3 px-2 text-center rounded-xl font-bold text-xs border-2 transition-all active:scale-95 cursor-pointer ${
                      selectedTopic === topic
                        ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {topic === 'integers' ? 'Bil. Bulat' : topic === 'sets' ? 'Himpunan' : 'SPLSV'}
                  </button>
                ))}
              </div>
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Nama Sekolah (Kop Surat):
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:outline-none text-sm font-semibold text-white"
              />
            </div>

            {/* Class Name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Kelas:
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:outline-none text-sm font-semibold text-white"
              />
            </div>

            {/* Teacher Name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Nama Guru Mata Pelajaran:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:outline-none text-sm font-semibold text-white"
              />
            </div>

          </div>

          {/* PDF Specifications Info */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-200 text-sm">Pratinjau Format LKPD Polya:</p>
              <p>Brosur LKPD dicetak dengan KOP instansi resmi, mencakup tabel nama kelompok, kolom identifikasi <strong>Diketahui (Knowns)</strong>, <strong>Ditanya (Unknowns)</strong>, <strong>Model Aljabar</strong>, sela <strong>Strategi Simulasi Game</strong>, dan kotak <strong>Kesimpulan (Conclusion)</strong>.</p>
              <p className="text-slate-500">Cocok untuk penugasan tertulis berbasis kelompok sewaktu bergiliran maju ke monitor 70"!</p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-800">
            {successMsg && (
              <div className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/40 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {successMsg}
              </div>
            )}

            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:translate-y-1 shadow-lg cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-500 text-slate-950 hover:bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              }`}
              id="btn-download-pdf-lkpd"
            >
              {isGenerating ? 'Mengekspor PDF...' : 'Unduh LKPD Cetak (PDF)'}
              <Download className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
