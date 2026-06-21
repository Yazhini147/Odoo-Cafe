// ── OrderSummary — warm brown café theme ─────────────────────────────────────
export default function OrderSummary({ subtotal, discount = 0, taxRate = 0.05, onPay, selectedCustomer }) {
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

  // Load payment settings dynamically from localStorage with defaults
  const settings = (() => {
    try {
      const stored = localStorage.getItem('payment_settings');
      return stored ? JSON.parse(stored) : { cash: true, card: true, upi: true, upiId: 'cafe@ybl' };
    } catch {
      return { cash: true, card: true, upi: true, upiId: 'cafe@ybl' };
    }
  })();

  const methods = [];
  if (settings.cash) methods.push('Cash');
  if (settings.card) methods.push('Card');
  if (settings.upi)  methods.push('UPI QR');

  const handlePay = (method) => {
    if (typeof onPay === 'function') onPay(method);
  };

  return (
    <section className="café-card space-y-5 p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
          Order Summary
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#a8602a' }}>Confirm totals and choose payment</p>
        {selectedCustomer && (
          <p className="mt-2 text-xs font-semibold" style={{ color: '#7e4720' }}>
            Customer: {selectedCustomer.name}
          </p>
        )}
      </div>

      {/* Breakdown */}
      <div className="space-y-2 rounded-2xl p-4 text-sm" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
        {[
          { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}` },
          { label: 'Tax (5%)', value: `₹${tax.toFixed(2)}` },
          { label: 'Discount', value: `− ₹${discount.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between" style={{ color: '#5a3218' }}>
            <span>{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="rounded-2xl px-5 py-4 text-white"
           style={{ background: 'linear-gradient(135deg,#3b2010,#7e4720)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-80">Total Amount</span>
          <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment buttons */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${methods.length || 1}, minmax(0,1fr))` }}>
        {methods.length === 0 ? (
          <p className="col-span-3 rounded-2xl py-3 px-4 text-center text-sm font-semibold"
             style={{ background: '#fee2e2', color: '#b91c1c' }}>
            No payment methods enabled.
          </p>
        ) : (
          methods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handlePay(method)}
              className="rounded-2xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}
            >
              {method}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
