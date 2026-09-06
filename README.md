# บัญชีรายรับ-รายจ่าย (Mom's Money Notes)

เว็บแอปบันทึกรายรับ-รายจ่าย ออกแบบให้อ่านง่าย ปุ่มใหญ่ ใช้งานสะดวกบนมือถือ/แท็บเล็ต
เชื่อมต่อฐานข้อมูล Supabase แบบ Real-time (บันทึกจากมือถือ เห็นผลบนคอมทันที)

## โครงสร้างไฟล์โปรเจกต์

```
mom-money-notes/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── supabase/
│   └── schema.sql          ← SQL สำหรับสร้างตารางใน Supabase
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── supabaseClient.js   ← ฟังก์ชันเชื่อมต่อ/ดึง/เพิ่ม/ลบ/real-time
    └── components/
        ├── TransactionForm.jsx
        ├── TransactionList.jsx
        ├── SummaryCards.jsx
        └── PrintReport.jsx
```

## ขั้นตอนที่ 1: สร้างโปรเจกต์ Supabase

1. ไปที่ https://supabase.com สร้างบัญชีและโปรเจกต์ใหม่ (ฟรี)
2. เปิด **SQL Editor** แล้ววางโค้ดทั้งหมดจากไฟล์ `supabase/schema.sql` แล้วกด Run
3. ไปที่ **Project Settings → API** คัดลอกค่า:
   - `Project URL`
   - `anon public` key

## ขั้นตอนที่ 2: ติดตั้งโปรเจกต์ใน VS Code

เปิด Terminal ใน VS Code แล้วรันคำสั่งตามลำดับ:

```bash
# ติดตั้ง dependencies ทั้งหมด (React, Tailwind, Supabase, Lucide)
npm install

# หากยังไม่มี Tailwind ในโปรเจกต์ (กรณีเริ่มจากศูนย์) ให้ใช้คำสั่งนี้แทน
npm install -D tailwindcss postcss autoprefixer vite @vitejs/plugin-react
npm install react react-dom @supabase/supabase-js lucide-react
```

จากนั้นสร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (คัดลอกจาก `.env.example`) แล้วใส่ค่าจริงจาก Supabase:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ขั้นตอนที่ 3: รันโปรเจกต์

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

## ขั้นตอนที่ 4: Deploy ขึ้น Vercel (ฟรี)

1. อัปโค้ดขึ้น GitHub repository
2. ไปที่ https://vercel.com สมัคร/ล็อกอินด้วย GitHub
3. กด **Add New Project** เลือก repository นี้
4. ในหน้า **Environment Variables** ใส่:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. กด **Deploy** — เสร็จแล้วจะได้ลิงก์เว็บใช้งานได้ทันที

### หรือ Deploy ขึ้น Netlify (ฟรี)

```bash
npm run build
```

1. ไปที่ https://netlify.com สร้างไซต์ใหม่ → **Deploy manually**
2. ลากโฟลเดอร์ `dist/` ที่ได้จาก `npm run build` ไปวาง
3. ไปที่ **Site settings → Environment variables** เพิ่ม `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`
4. กด **Trigger deploy** อีกครั้งเพื่อให้ build ใหม่ด้วยค่า env ที่ถูกต้อง

## ฟีเจอร์หลัก

- บันทึกรายรับ/รายจ่ายด้วยฟอร์มปุ่มใหญ่ อ่านง่าย เหมาะกับผู้สูงอายุ
- การ์ดสรุปยอด: รายรับรวม, รายจ่ายรวม, คงเหลือสุทธิ
- กรองข้อมูลแบบรายเดือน / รายปี / ทั้งหมด
- ข้อมูลซิงค์ Real-time ทุกอุปกรณ์ผ่าน Supabase
- พิมพ์รายงานเป็น PDF/กระดาษ A4 (ปุ่ม "พิมพ์รายงาน")
