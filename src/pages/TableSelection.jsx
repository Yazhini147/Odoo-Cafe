// ── TableSelection — warm brown café theme ────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

const floorTabs = ['Ground Floor', 'First Floor'];

const defaultTables = [
  { id: 1, number: 'Table 1', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 2, number: 'Table 2', seats: 4, status: 'Occupied',  floor: 'Ground Floor' },
  { id: 3, number: 'Table 3', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 4, number: 'Table 4', seats: 4, status: 'Occupied',  floor: 'First Floor' },
  { id: 5, number: 'Table 5', seats: 6, status: 'Available', floor: 'First Floor' },
  { id: 6, number: 'Table 6', seats: 4, status: 'Available', floor: 'First Floor' },
];

export default function TableSelection({ onSelectTable }) {
  useAuthGuard('Employee');
  const [activeFloor, setActiveFloor] = useState('Ground Floor');
  const [tablesList, setTablesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tables');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTablesList(parsed);
        console.log('Tables loaded by TableSelection (from localStorage):', parsed);
      } else {
        setTablesList(defaultTables);
        localStorage.setItem('tables', JSON.stringify(defaultTables));
        console.log('Tables loaded by TableSelection (from defaultTables):', defaultTables);
      }
    } catch (e) {
      setTablesList(defaultTables);
      console.log('Tables loaded by TableSelection (from fallback):', defaultTables);
    }
  }, []);

  const tables = useMemo(() => tablesList.filter((t) => t.floor === activeFloor), [tablesList, activeFloor]);

  const handleTableClick = (table) => { onSelectTable(table); navigate('/pos'); };
  const handleLogout = () => { localStorage.removeItem('current_user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="café-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
                   style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                🪑
              </div>
              <div>
                <p className="section-label">Odoo Cafe</p>
                <h1 className="text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Table Selection
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/kitchen')} className="btn-outline">
                Kitchen Display
              </button>
              <button type="button" onClick={handleLogout}
                className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#b91c1c' }}>
                Logout
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6" style={{ color: '#7e4720' }}>
            Choose a floor and select a table to start the order. Table statuses update the availability view.
          </p>
        </div>

        {/* Floor tabs + tables */}
        <div className="café-card p-6">
          {/* Floor tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {floorTabs.map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => setActiveFloor(floor)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                style={activeFloor === floor
                  ? { background: 'linear-gradient(135deg,#3b2010,#7e4720)', color: '#fff' }
                  : { background: '#f7e8d3', color: '#7e4720' }
                }
              >
                {floor}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              const isAvailable = table.status === 'Available';
              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => handleTableClick(table)}
                  className="group rounded-3xl border-2 p-6 text-left transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: isAvailable ? '#fdf6ee' : '#fff5f5',
                    borderColor: isAvailable ? '#eecba0' : '#fecaca',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                         style={{ background: isAvailable ? '#f7e8d3' : '#fee2e2' }}>
                      {isAvailable ? '🟢' : '🔴'}
                    </div>
                    <span className={isAvailable ? 'badge-green' : 'badge-red'}>
                      {table.status}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                    {table.number}
                  </h2>
                  <div className="mt-3 flex items-center justify-between text-sm" style={{ color: '#7e4720' }}>
                    <span>Seats</span>
                    <span className="font-bold text-base" style={{ color: '#3b2010' }}>{table.seats}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
