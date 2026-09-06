import React from 'react'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'

function formatBaht(n) {
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateThai(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl2 border border-cream-200 p-10 text-center text-ink-700/60 text-lg">
        ยังไม่มีรายการในช่วงเวลานี้
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => {
        const isIncome = t.type === 'income'
        return (
          <div
            key={t.id}
            className="bg-white rounded-xl2 border border-cream-200 p-4 sm:p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                ${isIncome ? 'bg-sage-100 text-sage-600' : 'bg-clay-100 text-clay-600'}`}
            >
              {isIncome ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-ink-800 truncate">{t.category}</p>
                <p className={`font-extrabold text-lg shrink-0 ${isIncome ? 'text-sage-600' : 'text-clay-600'}`}>
                  {isIncome ? '+' : '-'}{formatBaht(t.amount)} ฿
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-sm text-ink-700/60">
                  {formatDateThai(t.date)}
                  {t.note ? ` · ${t.note}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDelete(t.id)}
              className="no-print shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-ink-700/40 hover:text-clay-600 hover:bg-clay-50 transition"
              aria-label="ลบรายการ"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
