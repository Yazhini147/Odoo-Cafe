// ── Cart — warm brown café theme ─────────────────────────────────────────────
export default function Cart({ cartItems, onIncrease, onDecrease, onRemove }) {
  return (
    <section className="café-card space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#eecba0' }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
            Your Order
          </h2>
          <p className="text-xs" style={{ color: '#a8602a' }}>Review and update selected items</p>
        </div>
        <span className="badge-warm">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {cartItems.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed px-6 py-10 text-center"
               style={{ borderColor: '#eecba0', color: '#a8602a' }}>
            <p className="text-2xl mb-2">🛒</p>
            <p className="text-sm font-medium">Your cart is empty</p>
            <p className="text-xs mt-1 opacity-70">Add products to begin the order</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="rounded-2xl p-4" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: '#3b2010' }}>{item.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#a8602a' }}>₹{item.price} each</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2 rounded-full px-1 py-1 shadow-coffee-sm"
                     style={{ background: '#fff', border: '1.5px solid #eecba0' }}>
                  <button
                    type="button"
                    onClick={() => onDecrease(item.id)}
                    className="h-8 w-8 rounded-full text-base font-bold transition hover:scale-110 active:scale-95"
                    style={{ background: '#f7e8d3', color: '#7e4720' }}
                  >−</button>
                  <span className="min-w-[1.75rem] text-center text-sm font-bold" style={{ color: '#3b2010' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrease(item.id)}
                    className="h-8 w-8 rounded-full text-base font-bold transition hover:scale-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)', color: '#fff' }}
                  >+</button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold" style={{ color: '#c97a34' }}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-800"
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
