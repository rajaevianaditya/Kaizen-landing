# GoKaizen Landing Page

Portal komunitas server Minecraft — bukan cuma landing page quick-link, tapi:

- **Landing page** — hero (logo, deskripsi), status server live (player online, versi),
  tombol Copy IP, section "Kenapa Main di Sini" (fitur highlight), grid link
  (Vote/Store/Ban List/Discord/custom), preview galeri
- **Galeri** — screenshot server, diupload manual dari admin, ada lightbox penuh
- **Forum Komunitas** — registrasi akun (email + password), kategori, bikin thread,
  balas, like/upvote thread & balasan, edit/hapus post milik sendiri
- **Admin Dashboard** — kelola semuanya: info server, upload logo, links, fitur
  highlight, galeri, kategori forum

Next.js App Router (JSX, bukan TSX), plain CSS (bukan Tailwind), desain Claymorphism
konsisten dengan Coin Store (aksen merah, font Nunito + DM Sans).

Project ini **berdiri sendiri**, database-nya **terpisah** dari Coin Store maupun
plugin RA-CoinsEconomy/RA-StoreSync.

## Favicon & SEO

- **Favicon**: sekarang **dinamis** — otomatis pakai logo yang diupload admin lewat
  dashboard (`ServerInfo.logoUrl`). Kalau admin belum pernah upload logo sama sekali,
  fallback ke file statis `public/logo.png`. Taruh logo default di situ juga buat
  jaga-jaga (dipakai juga sebagai gambar Open Graph awal sebelum admin upload logo).
  Logic-nya di `generateMetadata()` pada `app/layout.js` — query `ServerInfo` tiap
  render, jadi begitu admin ganti logo dari dashboard, favicon & Open Graph image
  ikut berubah otomatis tanpa perlu redeploy.
- **Metadata SEO**: title template, description, Open Graph, Twitter card, dan
  `robots` meta udah diset di `app/layout.js`. Halaman `/admin`, `/login`,
  `/register` sengaja di-set `noindex` (nggak perlu muncul di hasil pencarian Google).
- **`robots.txt`** dan **`sitemap.xml`** ke-generate otomatis dari
  `app/robots.js` dan `app/sitemap.js` (fitur bawaan Next.js App Router, nggak
  perlu bikin file manual). Sitemap baru nyertain halaman statis (`/`, `/gallery`,
  `/forum`, dll) — kalau mau nyertain tiap thread forum secara dinamis di sitemap,
  ada catatan caranya langsung di komentar `app/sitemap.js`.
- Isi `NEXT_PUBLIC_SITE_URL` di `.env` dengan domain final Anda (bukan
  `localhost`), soalnya dipakai buat generate URL absolut di sitemap & Open Graph.

## Setup

```bash
npm install
cp .env.example .env    # isi DATABASE_URL (database BARU) & ADMIN_PASSWORD
npx prisma generate
npx prisma db push
npx prisma db seed       # opsional, isi data contoh
npm run dev
```

Buka `http://localhost:3000` buat landing page, `/admin` buat dashboard admin,
`/forum` buat forum komunitas, `/gallery` buat galeri.

## Cara Kerja Status Server Live

`lib/minecraft-ping.js` query server Minecraft langsung lewat protokol **Server List
Ping (SLP)**, protokol bawaan yang sama dipakai tab "Multiplayer" client game. Nggak
butuh plugin tambahan. Di-cache 15 detik (`app/api/server-status/route.js`) biar
nggak nge-ping server tiap ada pengunjung buka halaman.

## Sistem Auth Forum

Auth forum ini **terpisah total** dari login admin (`ADMIN_PASSWORD`) dan dari akun
Minecraft di Coin Store. Alurnya:

- Register: `username` + `email` + `password` (di-hash pakai bcrypt, disimpan di
  tabel `forum_users`)
- Login: bikin session token random (`forum_sessions`), disimpan di cookie
  httpOnly, valid 30 hari
- Logout: hapus row session dari DB + cookie

**Kenapa bukan JWT?** Session di-simpan di DB (bukan JWT stateless) biar bisa
di-invalidate kapan aja (misal butuh fitur "logout paksa" atau ban user suatu saat),
dan supaya nggak perlu mikirin secret key rotation.

## Upload File (Logo & Galeri)

Logo (`app/api/admin/upload-logo/route.js`) dan foto galeri
(`app/api/admin/gallery/route.js`) disimpan ke **disk lokal** di folder
`public/uploads/`, bukan ke cloud storage.

**PENTING kalau deploy:**
- Ini cuma jalan bener di **VPS/server dengan disk persisten** (misal deploy manual
  pakai PM2/systemd di VPS Hostinger/DigitalOcean/dll)
- **TIDAK cocok** buat platform serverless kayak Vercel — di sana filesystem
  bersifat read-only/ephemeral saat runtime, file yang diupload bakal hilang tiap
  deploy ulang atau malah gagal ke-write sama sekali
- Kalau nanti pindah ke Vercel atau mau lebih robust, upload perlu diarahkan ke
  object storage (S3, Cloudinary, dll) — bukan filesystem lokal

## Kategori Forum

Kategori dibuat manual dari admin (`Kategori Forum` tab), bukan hardcode. Slug
di-generate otomatis dari nama (misal "Diskusi Umum" jadi `diskusi-umum`). Kategori
yang masih punya thread di dalamnya nggak bisa dihapus (harus dikosongin/dipindah
dulu threadnya) — ini guard di `app/api/admin/forum-categories/[id]/route.js`.

## Moderasi Forum

Admin (yang login lewat `/admin`) bisa hapus thread/reply **siapapun** (bukan cuma
punya sendiri) — dicek lewat `isAdminSession()` di endpoint DELETE. User biasa cuma
bisa edit/hapus post miliknya sendiri. Belum ada UI moderasi terpisah di dashboard
admin buat forum (misal list semua thread buat di-hapus dari situ) — untuk sekarang
moderasi dilakuin dengan buka halaman thread yang mau dihapus terus request DELETE
manual, atau saya bisa tambahin UI-nya kalau dibutuhin.

## Struktur

```
lib/
  auth.js              — hash password, session forum
  admin-session.js      — auth admin (terpisah dari auth forum)
  prisma.js
  minecraft-ping.js

components/
  Navbar.jsx
  CopyIpButton.jsx, ServerStatusStrip.jsx
  FeaturesSection.jsx, GalleryPreview.jsx, LinkGrid.jsx
  AdminDashboard.jsx    — 5 tab: Info Server, Links, Fitur, Galeri, Kategori Forum

app/
  page.js               — landing
  gallery/page.js
  login/page.js, register/page.js
  forum/page.js, forum/[categorySlug]/page.js, forum/new/page.js,
  forum/thread/[id]/page.js
  admin/page.js, admin/login/page.js
  api/...                — semua route API (public, admin, auth, forum)
```

## Requirements

- Node.js 18+
- MySQL (database terpisah dari Coin Store)
- Disk storage yang persisten kalau mau pakai fitur upload logo/galeri
