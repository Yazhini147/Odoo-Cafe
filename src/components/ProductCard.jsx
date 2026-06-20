export default function ProductCard({ product, onAdd }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-amber-100">
        <span className="text-3xl font-semibold text-amber-700">{product.name.charAt(0)}</span>
      </div>
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
          <p className="text-sm text-slate-500">{product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
