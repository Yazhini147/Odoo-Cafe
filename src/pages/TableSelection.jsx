import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

const floorTabs = ['Ground Floor', 'First Floor'];

const defaultTables = [
  { id: 1, number: 'Table 1', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 2, number: 'Table 2', seats: 4, status: 'Occupied', floor: 'Ground Floor' },
  { id: 3, number: 'Table 3', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 4, number: 'Table 4', seats: 4, status: 'Occupied', floor: 'First Floor' },
  { id: 5, number: 'Table 5', seats: 6, status: 'Available', floor: 'First Floor' },
  { id: 6, number: 'Table 6', seats: 4, status: 'Available', floor: 'First Floor' },
];

const statusStyles = {
  Available: 'bg-emerald-100 text-emerald-700',
  Occupied: 'bg-rose-100 text-rose-700',
};

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

  const tables = useMemo(
    () => tablesList.filter((table) => table.floor === activeFloor),
    [tablesList, activeFloor]
  );

  const handleTableClick = (table) => {
    onSelectTable(table);
    navigate('/pos');
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Odoo Cafe</p>
              <h1 className="text-3xl font-semibold text-slate-900">Table Selection</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/kitchen')}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Kitchen Display
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            Choose a floor and select a table to start the order. Table statuses update the availability view.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
          <div className="mb-6 flex flex-wrap gap-3">
            {floorTabs.map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => setActiveFloor(floor)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeFloor === floor
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => handleTableClick(table)}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{table.number}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">{table.number}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[table.status]}`}>
                    {table.status}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
                  <span>Seats</span>
                  <span className="font-semibold text-slate-900">{table.seats}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
