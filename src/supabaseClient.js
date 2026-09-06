import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ในไฟล์ .env — โปรแกรมจะเชื่อมต่อฐานข้อมูลไม่ได้'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TABLE = 'transactions'

// ดึงรายการทั้งหมด เรียงจากวันที่ล่าสุดไปเก่าสุด
export async function fetchTransactions() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// เพิ่มรายการใหม่
// entry: { type: 'income' | 'expense', amount: number, category: string, date: 'YYYY-MM-DD', note: string }
export async function addTransaction(entry) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([entry])
    .select()

  if (error) throw error
  return data?.[0]
}

// ลบรายการตาม id
export async function deleteTransaction(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

// สมัครรับการอัปเดตแบบ Real-time
// callback จะถูกเรียกทุกครั้งที่มีการ insert/delete/update บนตาราง transactions
export function subscribeToTransactions(callback) {
  const channel = supabase
    .channel('transactions-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE },
      (payload) => callback(payload)
    )
    .subscribe()

  // คืนฟังก์ชันไว้สำหรับยกเลิกการสมัครตอน component unmount
  return () => supabase.removeChannel(channel)
}
