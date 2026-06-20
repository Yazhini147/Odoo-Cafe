import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Customers({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectMode = location.state && location.state.selectMode;

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_customers');
    setCustomers(stored ? JSON.parse(stored) : []);
  }, []);

  const persist = (next) => {
    setCustomers(next);
    localStorage.setItem('restaurant_customers', JSON.stringify(next));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.name.trim()) return alert('Name is required');
    const newCustomer = { id: Date.now(), ...form };
    const next = [newCustomer, ...customers];
    persist(next);
    setForm({ name: '', email: '', phone: '' });
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone });
  };

  const handleUpdate = () => {
    const next = customers.map((c) => (c.id === editingId ? { ...c, ...form } : c));
    persist(next);
    setEditingId(null);
    setForm({ name: '', email: '', phone: '' });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete customer?')) return;
    const next = customers.filter((c) => c.id !== id);
    persist(next);
  };

  const handleSelect = (c) => {
    if (typeof onSelectCustomer === 'function') {
      onSelectCustomer(c);
      navigate('/pos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Customers</p>
              <h1 className="text-2xl font-semibold text-slate-900">Manage Customers</h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/tables')}
                className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
          <div className="grid gap-3 sm:grid-cols-3">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="rounded-2xl border px-4 py-2" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="rounded-2xl border px-4 py-2" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="rounded-2xl border px-4 py-2" />
          </div>

          <div className="mt-4 flex gap-2">
            {editingId ? (
              <>
                <button onClick={handleUpdate} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white">Update</button>
                <button onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '' }); }} className="rounded-2xl bg-slate-200 px-4 py-2">Cancel</button>
              </>
            ) : (
              <button onClick={handleAdd} className="rounded-2xl bg-slate-900 px-4 py-2 text-white">Add Customer</button>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {customers.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-slate-500">No customers yet.</div>
          ) : (
            customers.map((c) => (
              <div key={c.id} className="rounded-3xl bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">{c.name}</div>
                  <div className="mt-1 text-xs text-slate-600">{c.email} · {c.phone}</div>
                </div>
                <div className="flex gap-2">
                  {selectMode && (
                    <button onClick={() => handleSelect(c)} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white">Select</button>
                  )}
                  <button onClick={() => handleEdit(c)} className="rounded-2xl bg-slate-100 px-4 py-2">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="rounded-2xl bg-rose-100 px-4 py-2 text-rose-700">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
