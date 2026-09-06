import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Printer, Wallet2 } from 'lucide-react'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionList from './components/TransactionList.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import PrintReport from './components/PrintReport.jsx'
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  subscribeToTransactions,
} from './supabaseClient.js'

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

function toBuddhistYear(year) {
  return year + 543
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const now = new Date()
  const [filterMode, setFilterMode] = useState('month') // 'month' | 'year' | 'all'
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()) // 0-11
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const loadData = useCallback(async () => {
    try {
      setErrorMsg('')
      const data = await fetchTransactions()
      setTransactions(data || [])
    } catch (err) {
      console.error(err)
      setErrorMsg('เชื่อมต่อฐานข้อมูลไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Supabase ในไฟล์ .env')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToTransactions(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [loadData])

  async function handleAdd(entry) {
    setSubmitting(true)
    try {
      const created = await addTransaction(entry)
      if (created) {
        setTransactions((prev) => [created, ...prev])
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('บันทึกรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    const prev = transactions
    setTransactions((cur) => cur.filter((t) => t.id !== id))
    try {
      await deleteTransaction(id)
    } catch (err) {
      console.error(err)
      setErrorMsg('ลบรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      setTransactions(prev)
    }
  }

  const filtered = useMemo(() => {
    if (filterMode === 'all') return transactions
    return transactions.filter((t) => {
      const d = new Date(t.date)
      if (filterMode === 'year') return d.getFullYear() === selectedYear
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
    })
  }, [transactions, filterMode, selectedMonth, selectedYear])

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
    [filtered]
  )
  const totalExpense = useMemo(
    () => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
    [filtered]
  )

  const yearOptions = useMemo(() => {
    const years = new Set(transactions.map((t) => new Date(t.date).getFullYear()))
    years.add(now.getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [transactions])

  const filterLabel = useMemo(() => {
    if (filterMode === 'all') return 'ทั้งหมด'
    if (filterMode === 'year') return `ปี ${toBuddhistYear(selectedYear)}`
    return `${THAI_MONTHS[selectedMonth]} ${toBuddhistYear(selectedYear)}`
  }, [filterMode, selectedMonth, selectedYear])

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* หัวข้อ */}
        <header className="no-print flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gold-400/20 flex items-center justify-center">
            <Wallet2 className="text-gold-500" size={30} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-800">บัญชีรายรับ-รายจ่าย</h1>
            <p className="text-ink-700/60">บันทึกง่าย ดูสรุปได้ทันที</p>
          </div>
        </header>

        {errorMsg && (
          <div className="no-print bg-clay-50 border-2 border-clay-100 text-clay-600 rounded-xl2 p-4 mb-6 font-medium">
            {errorMsg}
          </div>
        )}

        {/* ตัวกรอง */}
        <div className="no-print bg-white rounded-xl2 border border-cream-200 p-4 sm:p-5 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {[
              { key: 'month', label: 'รายเดือน' },
              { key: 'year', label: 'รายปี' },
              { key: 'all', label: 'ทั้งหมด' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterMode(opt.key)}
                className={`px-4 py-2 rounded-full font-semibold transition
                  ${filterMode === opt.key
                    ? 'bg-ink-800 text-white'
                    : 'bg-cream-100 text-ink-700 hover:bg-cream-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filterMode !== 'all' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 rounded-full border-2 border-cream-200 bg-cream-50 font-medium"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{toBuddhistYear(y)}</option>
              ))}
            </select>
          )}

          {filterMode === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 rounded-full border-2 border-cream-200 bg-cream-50 font-medium"
            >
              {THAI_MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-sage-600 text-white font-semibold hover:bg-sage-500 transition"
          >
            <Printer size={18} />
            พิมพ์รายงาน
          </button>
        </div>

        {/* สรุปยอด */}
        <div className="no-print mb-6">
          <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
        </div>

        <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionForm onAdd={handleAdd} submitting={submitting} />

          <div>
            <h2 className="text-xl font-bold text-ink-800 mb-3">
              ประวัติรายการ ({filterLabel})
            </h2>
            {loading ? (
              <div className="bg-white rounded-xl2 border border-cream-200 p-10 text-center text-ink-700/60">
                กำลังโหลดข้อมูล...
              </div>
            ) : (
              <TransactionList transactions={filtered} onDelete={handleDelete} />
            )}
          </div>
        </div>

        {/* ใช้สำหรับพิมพ์เท่านั้น */}
        <PrintReport
          transactions={filtered}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          filterLabel={filterLabel}
        />
      </div>
    </div>
  )
}
