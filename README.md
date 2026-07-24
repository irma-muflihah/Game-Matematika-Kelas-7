# 🧮 Media Pembelajaran Interaktif Matematika SMP
### **SMPN 2 Kemranjen** — *Guru Pengampu: Irma Muflihah, S.Pd.*

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Kurikulum Merdeka](https://img.shields.io/badge/Kurikulum-Merdeka_SMP-emerald)

Platform media pembelajaran matematika interaktif berbasis web yang dirancang khusus untuk memenuhi kebutuhan pembelajaran Matematika SMP Kelas VII di **SMPN 2 Kemranjen**. Aplikasi ini didesain agar optimal digunakan pada layar sentuh/interaktif papan tulis (*Interactive Whiteboard / Smart Display*) maupun perangkat komputer siswa, menggabungkan metode permainan visual dengan kerangka pemecahan masalah Polya (*Polya's 4-Step Problem Solving Framework*).

---

## 🌟 Fitur Utama

### 1. 🏎️ Balap Bilangan Bulat (*Integer Race*)
- Visualisasi balap mobil/kart di atas garis bilangan interaktif.
- Membantu siswa memahami konsep angka positif, negatif, serta operasi penjumlahan dan pengurangan secara nyata.
- Dilengkapi dengan simulasi animasi pergerakan kendaraan sesuai langkah perhitungan matematika.

### 2. ⭕ Venn Master (*Diagram Venn & Himpunan*)
- Simulator visual interaktif untuk konsep himpunan.
- Mendukung pemahaman visual operasi himpunan:
  - Irisan ($A \cap B$)
  - Gabungan ($A \cup B$)
  - Selisih ($A - B$)
  - Komplemen ($A^c$)
- Dilengkapi mode kuis interaktif dengan penentuan wilayah (*region shading*) secara akurat.

### 3. ⚖️ Timbangan Persamaan Linear (*Equation Balancer*)
- Visualisasi timbangan fisik untuk Persamaan Linear Satu Variabel (PLSV).
- Mengajarkan prinsip kesetaraan nilai aljabar: menambah, mengurangi, atau mengalikan kedua ruas secara seimbang.
- Memberikan pemahaman intuitif terhadap konsep manipulasi variabel aljabar.

### 4. 📊 Manajemen Roster Murid & Import Excel (`.xlsx`)
- **Import File Excel**: Fitur khusus bagi guru untuk mengunggah daftar nama murid dan kelas dari file `.xlsx` atau `.xls` secara langsung.
- **Input Manual Fallback**: Memungkinkan penambahan nama siswa satu per satu atau dalam jumlah banyak (*bulk text*).
- **LocalStorage Persistence**: Data roster murid tersimpan otomatis pada penyimpanan lokal browser tanpa memerlukan server eksternal.

### 5. 🎯 Pemilihan Identitas Pemain
- Sebelum memulai simulasi/permainan, siswa memilih nama mereka sendiri dari daftar roster yang telah diunggah atau memasukkan nama tamu.
- Skor akhir simulasi secara otomatis dicatat atas nama murid dan kelas yang bersangkutan.

### 6. 🏆 Leaderboard & Papan Skor
- Menampilkan daftar pencapaian skor tertinggi per topik materi.
- Dilengkapi fitur pencarian nama murid serta filter berdasarkan topik pembelajaran.

### 7. 📄 Generator LKPD Interaktif (*Lembar Kerja Peserta Didik*)
- Pembuatan dokumen LKPD siap cetak/unduh berformat resmi Kurikulum Merdeka.
- Terintegrasi dengan kustomisasi identitas **SMPN 2 Kemranjen** dan nama **Irma Muflihah, S.Pd.**.
- Menyediakan soal berstruktur HOTS (*Higher Order Thinking Skills*) lengkap dengan rubrik penilaian.

### 8. 🏛️ Arsitektur Sistem & TPACK
- Dokumentasi kerangka kerja pedagogis berbasis **TPACK** (*Technological Pedagogical Content Knowledge*).
- Transparansi panduan *Prompt Engineering* yang melandasi perancangan modul interaktif.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Animasi & Transisi**: [Motion](https://motion.dev/)
- **Pemrosesan Excel**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Penyimpanan Data**: LocalStorage (Offline-First Approach)

---

## 🚀 Cara Menjalankan Proyek di Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.0 atau yang lebih baru
- `npm` atau `bun`

### Langkah Instalasi

1. **Clone repositori ini**:
   ```bash
   git clone https://github.com/username/smpn2kemranjen-math-playground.git
   cd smpn2kemranjen-math-playground
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development Mode)**:
   ```bash
   npm run dev
   ```
   Buka browser dan akses `http://localhost:3000`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 📂 Struktur Direktori

```text
├── src/
│   ├── components/
│   │   ├── EquationBalancer.tsx   # Simulator Timbangan PLSV
│   │   ├── IntegerRace.tsx        # Game Balap Bilangan Bulat
│   │   ├── Leaderboard.tsx        # Papan Skor & Pencatatan Nilai
│   │   ├── LearningObjectives.tsx # Pemilihan Pemain & Indikator IPK
│   │   ├── LkpdGenerator.tsx      # Generator Cetak LKPD
│   │   ├── MainMenu.tsx           # Menu Utama & Manajemen Excel Roster
│   │   ├── SystemArchitecture.tsx # Dokumentasi TPACK & Prompt
│   │   └── VennMaster.tsx         # Simulator & Kuis Diagram Venn
│   ├── App.tsx                    # Entry Point Utama & State Handler
│   ├── main.tsx                   # Mounting React DOM
│   ├── types.ts                   # Tipe Data TypeScript
│   └── index.css                  # Konfigurasi Tailwind CSS
├── package.json
└── README.md
```

---

## 🎓 Informasi Akademik

- **Instansi**: SMPN 2 Kemranjen
- **Mata Pelajaran**: Matematika
- **Sasaran**: Siswa Kelas VII (Fase D)
- **Kurikulum**: Kurikulum Merdeka
- **Guru Pengampu**: Irma Muflihah, S.Pd.

---

<p align="center">
  <i>Dikembangkan untuk meningkatkan keterlibatan interaktif dan pemahaman konsep matematika siswa SMPN 2 Kemranjen.</i>
</p>
