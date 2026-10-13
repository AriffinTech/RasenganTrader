# Panduan Pengurusan Admin & Sistem Kelas RasenganTrader

Dokumen ini menyediakan panduan lengkap bagi pentadbir laman web **RasenganTrader** untuk menguruskan sesi kelas, silibus pembelajaran, bonus eksklusif, pautan jemputan Telegram, dan kupon diskaun.

---

## 1. Persediaan Awal Supabase (Pangkalan Data & Pengesahan)

Sistem ini dikuasakan oleh **Supabase** (PostgreSQL, Auth, dan Cloud Storage) yang berjalan pada pelan percuma ($0/bulan).

### Langkah 1: Cipta Projek Supabase
1. Daftar akaun percuma di [supabase.com](https://supabase.com).
2. Tekan **New Project** dan namakan projek (contoh: `rasengan-trader`).
3. Tetapkan kata laluan pangkalan data dan pilih rantau terdekat (contoh: `Singapore - ap-southeast-1`).

### Langkah 2: Laksanakan Skrip SQL (Migration)
1. Di papan pemuka Supabase, buka menu **SQL Editor** pada bar sisi kiri.
2. Buka fail skrip migration di [`supabase/migrations/20261011_initial_schema.sql`](../supabase/migrations/20261011_initial_schema.sql).
3. Salin keseluruhan teks SQL dan tampal ke dalam SQL Editor Supabase.
4. Tekan butang **Run**.
5. Ini akan mencipta:
   - Jadual `courses`, `class_sessions`, `discount_codes`, dan `site_settings`.
   - Polisi keselamatan Row Level Security (RLS).
   - Bucket simpanan poster `class-posters` di Supabase Storage.

### Langkah 3: Tetapkan Kunci Rahsia (Environment Variables)
Buka menu **Project Settings -> API** di Supabase dan salin kunci berikut ke dalam fail `.env.local` pada hosting Vercel anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://projek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci-anon-anda
SUPABASE_SERVICE_ROLE_KEY=kunci-service-role-anda
```

### Langkah 4: Cipta Akaun Pentadbir Pertama
1. Di Supabase, buka menu **Authentication -> Users**.
2. Tekan **Add User** -> **Create User**.
3. Masukkan emel pentadbir (contoh: `admin@rasengantrader.com`) dan kata laluan selamat.
4. Tandakan **Auto Confirm User?** sebagai aktif.

---

## 2. Cara Log Masuk ke Admin Dashboard

1. Layari pautan: `https://rasengantrader.com/admin/login` (atau `http://localhost:3000/admin/login` semasa ujian tempatan).
2. Masukkan emel dan kata laluan pentadbir yang telah didaftarkan.
3. Tekan butang **Log Masuk Dashboard**.
4. Semua laluan di bawah `/admin` dilindungi secara ketat. Pengguna tanpa kebenaran akan dialihkan secara automatik ke skrin log masuk.

---

## 3. Pengurusan Sesi Kelas & Intake

Buka menu **Pengurusan Sesi Kelas** (`/admin/classes`).

### Menjadualkan Sesi Baru:
1. Tekan butang **Tambah Sesi Baru**.
2. **Pilih Kursus Asas**: Pilih kursus induk (contoh: *True SMC Fast Track* atau *Saham 101*).
3. **Tajuk Sesi**: Masukkan nama sesi (contoh: `True SMC Fast Track - Intake Disember 2026`).
4. **Tarikh & Masa**: Masukkan teks tarikh paparan (contoh: `12 & 13 Disember 2026`) dan masa kelas.
5. **Yuran (RM)**: Tetapkan yuran pendaftaran bagi intake tersebut.
6. **Status Pendaftaran**:
   - `Upcoming (Opening Soon)`: Papar lencana 'Opening Soon' (pendaftaran belum dibuka).
   - `Open`: Papar butang 'Daftar Kelas' dan terima bayaran Billplz.
   - `Completed (Sesi Rakaman)`: Sesi langsung telah selesai, tetapi pendaftaran rakaman kekal dibuka.
   - `Closed`: Ditutup / Penuh.
   - `Archived`: Sembunyi daripada laman awam.
7. **Pautan Telegram Override (Pilihan)**:
   - Jika dibiarkan kosong, sistem secara automatik menggunakan pautan default kursus induk.
   - Jika intake ini mempunyai group khas, masukkan pautan jemputan Telegram di sini.
8. **Muat Naik Poster**: Pilih fail poster (JPG, PNG, WebP) sehingga saiz 5MB. Imej akan dimuat naik ke Supabase Storage.
9. Tekan **Simpan Perubahan**. Perubahan akan terus terpapar pada laman web dalam masa beberapa saat!

---

## 4. Kitaran Hayat Kelas (~30 Hari Sesi Rakaman)

Sistem ini direka khas mengikut keperluan operasi RasenganTrader:
1. Apabila sesi kelas langsung selesai, status **tidak** ditutup serta-merta.
2. Peserta masih boleh mendaftar untuk mengakses rakaman dan bahan pembelajaran selama ~1 bulan selepas kelas selesai.
3. **Pembantu Kitaran Hayat (Lifecycle Assistant)**:
   - Di halaman utama Admin Dashboard (`/admin`), sistem akan memeriksa tarikh tamat setiap kelas secara automatik.
   - Selepas 30 hari dari tarikh tamat, satu kotak amaran berwarna oren akan dipaparkan:
     > *"Peringatan Kitaran Hayat Kelas: Kelas telah melepasi 30 hari tamat sesi. Adakah anda ingin menutup pendaftaran?"*
   - Pentadbir mempunyai kawalan manual penuh dengan 1 klik:
     - Tekan **Tutup Pendaftaran (Closed)** untuk menutup pendaftaran.
     - Atau tekan **Kekalkan Sesi Rakaman** jika ingin terus menjual rakaman tersebut.

---

## 5. Pengurusan Silibus & Exclusive Bonus Box

Buka menu **Katalog & Silibus** (`/admin/courses`) -> Pilih kursus -> **Urus Silibus & Bonus**.

### Menguruskan Silibus:
- Tambah atau padam modul pembelajaran dengan mudah.
- Masukkan topik-topik pelajaran mengikut format satu baris bagi setiap topik.

### Menguruskan Bonus Biasa:
- Senarai bonus standard dipaparkan pada bar sisi laman kursus.
- Masukkan satu bonus bagi setiap baris pada kotak teks.

### Kotak Sorotan Exclusive Bonus:
- Kursus utama (True SMC Fast Track) mempunyai kotak serlahan emas khas (`bg-primary/10 ring-primary/20`).
- Pentadbir boleh menukar:
  - **Tajuk Exclusive Bonus** (contoh: *New Momentum Strategy: SPC Setup*)
  - **Label Lencana** (default: *EXCLUSIVE BONUS*)
  - **Kebaikan & Faedah** (satu baris setiap item)
- Terdapat **Pratonton Visual Langsung (Live Preview)** di bawah borang supaya pentadbir dapat melihat reka bentuk sebenar sebelum menekan simpan.

---

## 6. Pengurusan Kupon & Kod Diskaun

Buka menu **Kupon & Diskaun** (`/admin/discounts`).

### Menghasilkan Kod Baru:
1. Tekan **Hasilkan Kod Baru**.
2. **Kod Diskaun**: Masukkan kod promo (contoh: `FAST50`, `RAYA15`). Kod akan ditukar ke huruf besar secara automatik.
3. **Jenis Diskaun**:
   - `Jumlah Tetap (RM)`: Potongan tunai tetap (contoh: RM50).
   - `Peratusan (%)`: Potongan peratusan (contoh: 15% dari yuran kelas).
4. **Had Kursus**: Tetapkan sama ada kupon sah untuk semua kursus atau khusus untuk satu kursus tertentu sahaja.
5. **Had Penggunaan**: Tetapkan jumlah maksima kupon boleh ditebus (contoh: 50 orang terawal), atau biarkan kosong untuk tiada had.
6. **Tamat Tempoh**: Tetapkan tarikh akhir kupon.
7. Tekan **Simpan Kod Diskaun**.

### Keselamatan Pengiraan Harga di Gateway (Billplz):
- Kod diskaun disahkan secara terus di pelayan (**Server-Side Validation**).
- Pelanggan tidak boleh memanipulasi harga melalui penyemak imbas (inspect element).
- Jumlah yang dihantar ke Billplz FPX adalah jumlah akhir selepas potongan yang sah.
- Sekiranya diskaun 100% (percuma), sistem akan memintas portal pembayaran dan terus memberikan pendaftaran berjaya berserta pautan Telegram kelas.

---

## 7. Bantuan & Sokongan Teknikal

Sekiranya berlaku sebarang kesulitan atau memerlukan penyesuaian pangkalan data pada masa hadapan, sila rujuk dokumentasi kod sumber di:
- Skema Pangkalan Data: `supabase/migrations/20261011_initial_schema.sql`
- Logik Pengiraan Harga & Gateway: `src/app/api/create-bill/route.ts`
- Logik Kupon: `src/lib/db/discounts.ts`
- Integrasi Telegram Post-Payment: `src/app/terima-kasih/page.tsx`
