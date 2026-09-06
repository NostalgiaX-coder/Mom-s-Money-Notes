import React from 'react'

function formatBaht(n) {
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateThai(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

// filterLabel: ข้อความอธิบายช่วงเวลาที่กำลังดู เช่น "เดือนกันยายน 2569" หรือ "ทั้งหมด"
export default function PrintReport({ transactions, totalIncome, totalExpense, filterLabel }) {
  const balance = totalIncome - totalExpense
  const printedAt = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div id="print-report" className="hidden print:block px-2 text-black">
      <h1 className="text-2xl font-bold text-center mb-1">รายงานบัญชีรายรับ-รายจ่าย</h1>
      <p className="text-center text-sm mb-1">ช่วงข้อมูล: {filterLabel}</p>
      <p className="text-center text-xs text-gray-600 mb-6">พิมพ์เมื่อ: {printedAt}</p>

      <table className="w-full text-sm mb-6 border-collapse">
        <tbody>
          <tr>
            <td className="border border-black px-3 py-2 font-semibold">รายรับรวม</td>
            <td className="border border-black px-3 py-2 text-right">{formatBaht(totalIncome)} บาท</td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-2 font-semibold">รายจ่ายรวม</td>
            <td className="border border-black px-3 py-2 text-right">{formatBaht(totalExpense)} บาท</td>
          </tr>
          <tr>
            <td className="border border-black px-3 py-2 font-semibold">คงเหลือสุทธิ</td>
            <td className="border border-black px-3 py-2 text-right font-bold">{formatBaht(balance)} บาท</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-black px-2 py-2 text-left">วันที่</th>
            <th className="border border-black px-2 py-2 text-left">ประเภท</th>
            <th className="border border-black px-2 py-2 text-left">หมวดหมู่</th>
            <th className="border border-black px-2 py-2 text-left">หมายเหตุ</th>
            <th className="border border-black px-2 py-2 text-right">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border border-black px-2 py-1">{formatDateThai(t.date)}</td>
              <td className="border border-black px-2 py-1">{t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</td>
              <td className="border border-black px-2 py-1">{t.category}</td>
              <td className="border border-black px-2 py-1">{t.note}</td>
              <td className="border border-black px-2 py-1 text-right">
                {t.type === 'income' ? '+' : '-'}{formatBaht(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
