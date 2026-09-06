import React, { useState } from 'react'
import { PlusCircle, TrendingUp, TrendingDown } from 'lucide-react'

const CATEGORIES = {
  income: ['เงินเดือน', 'ขายของ', 'รับโอน', 'ดอกเบี้ย', 'อื่นๆ'],
  expense: ['อาหาร', 'ค่าน้ำ-ไฟ', 'ซื้อของ', 'ค่าเดินทาง', 'ค่ายา', 'อื่นๆ'],
}

function todayStr() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 10)
}

export default function TransactionForm({ onAdd, submitting }) {
  const [type, setType] = useState('income')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES.income[0])
  const [date, setDate] = useState(todayStr())
  const [note, setNote] = useState('')

  function handleTypeChange(newType) {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) return

    await onAdd({
      type,
      amount: numericAmount,
      category,
      date,
      note: note.trim(),
    })

    setAmount('')
    setNote('')
  }

  const isIncome = type === 'income'

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print bg-white rounded-xl2 shadow-sm border border-cream-200 p-5 sm:p-6 space-y-5"
    >
      <h2 className="text-xl font-bold text-ink-800">บันทึกรายการใหม่</h2>

      {/* สวิตช์ รายรับ / รายจ่าย */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex items-center justify-center gap-2 py-4 rounded-xl2 text-lg font-bold transition
            ${isIncome
              ? 'bg-sage-500 text-white shadow-md'
              : 'bg-sage-50 text-sage-600 border-2 border-sage-100'}`}
        >
          <TrendingUp size={24} />
          รายรับ
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex items-center justify-center gap-2 py-4 rounded-xl2 text-lg font-bold transition
            ${!isIncome
              ? 'bg-clay-500 text-white shadow-md'
              : 'bg-clay-50 text-clay-600 border-2 border-clay-100'}`}
        >
          <TrendingDown size={24} />
          รายจ่าย
        </button>
      </div>

      {/* จำนวนเงิน */}
      <div>
        <label className="block text-base font-semibold text-ink-700 mb-2">
          จำนวนเงิน (บาท)
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full text-2xl font-bold px-4 py-4 rounded-xl2 border-2 border-cream-200 focus:border-gold-400 focus:outline-none bg-cream-50"
        />
      </div>

      {/* หมวดหมู่ */}
      <div>
        <label className="block text-base font-semibold text-ink-700 mb-2">
          หมวดหมู่
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full text-lg px-4 py-4 rounded-xl2 border-2 border-cream-200 focus:border-gold-400 focus:outline-none bg-cream-50"
        >
          {CATEGORIES[type].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* วันที่ */}
      <div>
        <label className="block text-base font-semibold text-ink-700 mb-2">
          วันที่
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full text-lg px-4 py-4 rounded-xl2 border-2 border-cream-200 focus:border-gold-400 focus:outline-none bg-cream-50"
        />
      </div>

      {/* หมายเหตุ */}
      <div>
        <label className="block text-base font-semibold text-ink-700 mb-2">
          หมายเหตุ (ถ้ามี)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น ซื้อของที่ตลาด"
          className="w-full text-lg px-4 py-4 rounded-xl2 border-2 border-cream-200 focus:border-gold-400 focus:outline-none bg-cream-50"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl2 text-xl font-bold text-white shadow-md transition disabled:opacity-60
          ${isIncome ? 'bg-sage-600 hover:bg-sage-500' : 'bg-clay-600 hover:bg-clay-500'}`}
      >
        <PlusCircle size={26} />
        {submitting ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
      </button>
    </form>
  )
}
