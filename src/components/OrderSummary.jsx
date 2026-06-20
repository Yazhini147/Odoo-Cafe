export default function OrderSummary({ subtotal, discount = 0, taxRate = 0.05, onPay, selectedCustomer }) {
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

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
        {['Cash', 'Card', 'UPI'].map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => handlePay(method)}
            className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {method}
          </button>
        ))}
      </div>
    </section>
  );
}
