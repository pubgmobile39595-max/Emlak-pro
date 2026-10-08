import { useState } from 'react'

function LoanCalculatorModal({ listing, onClose }) {
  const totalPrice = listing.price || 0
  
  const [amount, setAmount] = useState(Math.round(totalPrice * 0.8))
  const [rate, setRate] = useState(2.5)
  const [months, setMonths] = useState(120)
  const [down, setDown] = useState(Math.round(totalPrice * 0.2))
  const [result, setResult] = useState(null)

  const calculate = () => {
    const principal = parseFloat(amount) || 0
    const monthlyRate = (parseFloat(rate) || 0) / 100
    const n = parseInt(months) || 120

    if (principal <= 0) {
      alert('⚠️ Kredi tutarı giriniz')
      return
    }

    let monthly
    if (monthlyRate === 0) {
      monthly = principal / n
    } else {
      const factor = Math.pow(1 + monthlyRate, n)
      monthly = principal * (monthlyRate * factor) / (factor - 1)
    }

    const total = monthly * n
    const interest = total - principal

    setResult({
      monthly: Math.round(monthly),
      total: Math.round(total),
      interest: Math.round(interest),
      down: parseFloat(down) || 0
    })
  }

  const formatTL = (n) => n.toLocaleString('tr-TR') + ' ₺'

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>💳 Kredi Hesaplama</h2>
          <p style={{ color: '#7f8c8d', fontSize: '13px', marginBottom: '16px' }}>
            {listing.title} - {formatTL(totalPrice)}
          </p>

          <div className="form-grid">
            <div className="full">
              <label>Kredi Tutarı (₺)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label>Aylık Faiz (%)</label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div>
              <label>Vade (Ay)</label>
              <select value={months} onChange={(e) => setMonths(e.target.value)}>
                <option value="12">12 ay</option>
                <option value="24">24 ay</option>
                <option value="36">36 ay</option>
                <option value="60">60 ay</option>
                <option value="120">120 ay</option>
                <option value="180">180 ay</option>
                <option value="240">240 ay</option>
              </select>
            </div>
            <div className="full">
              <label>Peşinat (₺)</label>
              <input
                type="number"
                value={down}
                onChange={(e) => setDown(e.target.value)}
              />
            </div>
          </div>

          {result && (
            <div className="loan-result">
              <div className="loan-monthly-label">Aylık Taksit</div>
              <div className="loan-monthly">{formatTL(result.monthly)}</div>
              <div className="loan-grid">
                <div>
                  <span>Toplam Ödeme:</span>
                  <strong>{formatTL(result.total)}</strong>
                </div>
                <div>
                  <span>Toplam Faiz:</span>
                  <strong>{formatTL(result.interest)}</strong>
                </div>
              </div>
              {result.down > 0 && (
                <div className="loan-down-info">
                  Peşinat: {formatTL(result.down)} | Toplam Maliyet: {formatTL(result.total + result.down)}
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-primary" onClick={calculate}>
              🧮 Hesapla
            </button>
            <button className="btn-secondary" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculatorModal
