-- ============================================
-- ตาราง transactions สำหรับระบบบัญชีรายรับ-รายจ่าย
-- นำโค้ดนี้ไปรันใน Supabase SQL Editor
-- ============================================

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  date date not null,
  note text default '',
  created_at timestamptz not null default now()
);

-- ดัชนีช่วยให้กรองข้อมูลตามวันที่ได้เร็วขึ้น
create index if not exists idx_transactions_date on public.transactions (date desc);

-- เปิดใช้งาน Row Level Security
alter table public.transactions enable row level security;

-- อนุญาตให้ทุกคนที่มี anon key อ่าน/เพิ่ม/ลบข้อมูลได้
-- (เหมาะสำหรับการใช้งานส่วนตัวในครอบครัว ไม่มีระบบล็อกอิน)
-- หากต้องการความปลอดภัยเพิ่มเติมในอนาคต ให้เปลี่ยนมาผูกกับ auth.uid() แทน
create policy "Allow read for everyone"
  on public.transactions for select
  using (true);

create policy "Allow insert for everyone"
  on public.transactions for insert
  with check (true);

create policy "Allow delete for everyone"
  on public.transactions for delete
  using (true);

-- เปิดใช้งาน Realtime สำหรับตารางนี้
alter publication supabase_realtime add table public.transactions;
