export default function Cart({ cartItems, onIncrease, onDecrease, onRemove }) {
  return (
    <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Cart</h2>
          <p className="text-sm text-slate-500">Review and update selected items</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {cartItems.length} items
        </span>
      </div>

      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500">
            Your cart is empty. Add products to begin the order.
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">Unit: ₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm shadow-slate-200">
                  <button
                    type="button"
                    onClick={() => onDecrease(item.id)}
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onIncrease(item.id)}
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-slate-600">Line Total: ₹{item.quantity * item.price}</div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-sm font-semibold text-rose-600 transition hover:text-rose-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
