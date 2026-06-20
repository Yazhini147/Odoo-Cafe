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
  if (settings.upi) methods.push('UPI QR');

  const handlePay = (method) => {
    if (typeof onPay === 'function') onPay(method);
  };

  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
        <p className="text-sm text-slate-500">Confirm totals and choose payment.</p>
        {selectedCustomer && (
          <p className="mt-2 text-sm text-slate-700">Customer: {selectedCustomer.name}</p>
        )}
      </div>

      <div className="space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span>- ₹{discount.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 px-5 py-5 text-white">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Total Amount</span>
          <span className="text-xl font-semibold text-white">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {methods.length === 0 ? (
          <p className="col-span-3 text-center text-sm text-rose-500 font-semibold bg-rose-50 rounded-2xl py-3 px-4">
            No payment methods enabled.
          </p>
        ) : (
          methods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handlePay(method)}
              className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {method}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
