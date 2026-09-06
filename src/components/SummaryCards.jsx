import React from 'react'
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react'

function formatBaht(n) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function SummaryCards({ totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-sage-50 border-2 border-sage-100 rounded-xl2 p-5 flex items-center gap-4">
        <ArrowUpCircle className="text-sage-600 shrink-0" size={36} />
        <div>
          <p className="text-sm font-semibold text-sage-600">รายรับรวม</p>
          <p className="text-2xl font-extrabold text-ink-800">{formatBaht(totalIncome)} ฿</p>
        </div>
      </div>

      <div className="bg-clay-50 border-2 border-clay-100 rounded-xl2 p-5 flex items-center gap-4">
        <ArrowDownCircle className="text-clay-600 shrink-0" size={36} />
        <div>
          <p className="text-sm font-semibold text-clay-600">รายจ่ายรวม</p>
          <p className="text-2xl font-extrabold text-ink-800">{formatBaht(totalExpense)} ฿</p>
        </div>
      </div>

      <div className="bg-gold-400/10 border-2 border-gold-400/40 rounded-xl2 p-5 flex items-center gap-4">
        <Wallet className="text-gold-500 shrink-0" size={36} />
        <div>
          <p className="text-sm font-semibold text-gold-500">คงเหลือสุทธิ</p>
          <p className={`text-2xl font-extrabold ${balance >= 0 ? 'text-ink-800' : 'text-clay-600'}`}>
            {formatBaht(balance)} ฿
          </p>
        </div>
      </div>
    </div>
  )
}
