import { useNavigate } from 'react-router-dom';

export default function Navbar({ employeeName, tableNumber, searchValue, onSearch }) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-white/90 px-6 py-5 shadow-sm shadow-slate-200/80 backdrop-blur-lg md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-500 text-2xl font-semibold text-white shadow-md shadow-amber-300/40">
          R
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Restaurant POS</p>
          <h1 className="text-xl font-semibold text-slate-900">Cafe Central</h1>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4 rounded-3xl bg-slate-100 px-4 py-3 shadow-inner shadow-slate-200/80">
        <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
        </svg>
        <input
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search products"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 shadow-sm shadow-slate-200/80 md:flex-row md:items-center">
        <div className="rounded-2xl bg-slate-100 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Employee</p>
          <p className="mt-1 text-sm font-semibold">{employeeName}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Table</p>
          <p className="mt-1 text-sm font-semibold">{tableNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => navigate('/kitchen')}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Kitchen
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Customers
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers', { state: { selectMode: true } })}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Select Customer
          </button>
        </div>
      </div>
    </header>
  );
}
