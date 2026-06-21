// ── Navbar — warm brown café theme ───────────────────────────────────────────
import { useNavigate } from 'react-router-dom';

export default function Navbar({ tableNumber, searchValue, onSearch }) {
  const navigate = useNavigate();
  let displayName = 'Employee';
  let roleLabel = 'EMPLOYEE';
  try {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      const userObj = JSON.parse(stored);
      roleLabel = userObj.role ? userObj.role.toUpperCase() : 'EMPLOYEE';
      const usersList = JSON.parse(localStorage.getItem('users')) || [];
      const found = usersList.find((u) => u.username.toLowerCase() === userObj.username.toLowerCase());
      displayName = found ? found.name : userObj.username;
    }
  } catch {
    // fallback
  }

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    navigate('/');
  };

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-coffee-100 bg-white/95 px-6 py-4 shadow-coffee-md backdrop-blur-lg md:flex-row md:items-center md:justify-between">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
             style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
          ☕
        </div>
        <div>
          <p className="section-label">Odoo Cafe</p>
          <h1 className="text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
            Cafe Central
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2.5 shadow-inner"
           style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#a8602a" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
        </svg>
        <input
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: '#3b2010' }}
        />
      </div>

      {/* User info + nav */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex gap-2">
          <div className="rounded-2xl px-4 py-2 text-center" style={{ background: '#f7e8d3' }}>
            <p className="section-label text-[9px]">Staff</p>
            <p className="mt-0.5 text-xs font-semibold" style={{ color: '#3b2010' }}>{roleLabel}: {displayName}</p>
          </div>
          <div className="rounded-2xl px-4 py-2 text-center" style={{ background: '#f7e8d3' }}>
            <p className="section-label text-[9px]">Table</p>
            <p className="mt-0.5 text-xs font-semibold" style={{ color: '#3b2010' }}>{tableNumber}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Orders',    path: '/orders' },
            { label: 'Kitchen',   path: '/kitchen' },
          ].map(({ label, path }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(path)}
              className="btn-primary px-3 py-2 text-xs"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 active:scale-95"
            style={{ background: '#b91c1c' }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
