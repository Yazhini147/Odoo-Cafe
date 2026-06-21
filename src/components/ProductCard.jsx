// ── ProductCard — warm brown café theme ──────────────────────────────────────
const PLACEHOLDER = '/images/placeholder.png';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="café-card group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-coffee-md">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
        />
        {/* Category badge overlay */}
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm"
              style={{ background: 'rgba(59,32,16,0.75)', color: '#fae8c0' }}>
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="text-base font-bold leading-tight" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h2>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: '#c97a34' }}>₹{product.price}</span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white shadow-coffee-sm transition-all duration-150 hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}
            aria-label={`Add ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
