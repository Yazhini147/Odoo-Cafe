// ── Dashboard — warm brown café theme ────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

const statusBadge = {
  Paid:       'badge-green',
  Completed:  'badge-sky',
  'To Cook':  'badge-amber',
  Preparing:  'badge-violet',
  Draft:      'badge-warm',
};

export default function Dashboard() {
  useAuthGuard();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const parseJSON = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };

  useEffect(() => { setOrders(parseJSON('restaurant_orders')); }, []);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'Completed').length;
    const paidOrders = orders.filter((o) => o.status === 'Paid').length;
    const revenueOrders = orders.filter((o) => ['Paid', 'Completed'].includes(o.status));
    const revenue = revenueOrders.reduce((s, o) => s + o.total, 0);
    const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
    const statusCounts = orders.reduce((c, o) => { c[o.status] = (c[o.status] || 0) + 1; return c; }, {});
    const paymentMethodRevenue = orders.reduce((acc, o) => {
      if (['Paid', 'Completed'].includes(o.status) && o.paymentMethod) acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
      return acc;
    }, {});
    return { totalOrders, completedOrders, paidOrders, revenue, averageOrderValue, statusCounts, paymentMethodRevenue };
  }, [orders]);

  const recentOrders = useMemo(() =>
    [...orders].sort((a, b) => {
      const aT = Number(a.orderNumber?.split('-')[1]) || new Date(a.createdAt).getTime();
      const bT = Number(b.orderNumber?.split('-')[1]) || new Date(b.createdAt).getTime();
      return bT - aT;
    }).slice(0, 6), [orders]
  );

  const statCards = [
    { label: 'Total Orders',      value: summary.totalOrders,                   icon: '📦' },
    { label: 'Revenue',           value: `₹${summary.revenue.toFixed(2)}`,       icon: '💰' },
    { label: 'Avg. Order Value',  value: `₹${summary.averageOrderValue.toFixed(2)}`, icon: '📊' },
    { label: 'Paid Orders',       value: summary.paidOrders,                    icon: '✅' },
  ];

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="café-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
                   style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                📈
              </div>
              <div>
                <p className="section-label">Odoo Cafe</p>
                <h1 className="text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Dashboard
                </h1>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/tables')} className="btn-primary">
              Select Table
            </button>
          </div>
          <p className="mt-3 text-sm leading-6" style={{ color: '#7e4720' }}>
            Overview of the latest restaurant performance, recent orders, and status summary.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon }) => (
            <div key={label} className="café-card p-6 hover:shadow-coffee-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="section-label text-[10px]">{label}</p>
                <span className="text-2xl">{icon}</span>
              </div>
              <p className="mt-4 text-3xl font-bold" style={{ color: '#3b2010' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Revenue + Payment breakdown */}
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
          {/* Revenue summary */}
          <div className="café-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Revenue Summary</p>
                <h2 className="mt-1 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Order Revenue
                </h2>
              </div>
              <span className="badge-warm text-[10px]">Live</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Paid / Completed', value: `₹${summary.revenue.toFixed(2)}` },
                { label: 'Paid Orders',      value: summary.paidOrders },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl p-5" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <p className="section-label text-[9px]">{label}</p>
                  <p className="mt-2 text-2xl font-bold" style={{ color: '#3b2010' }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl p-4 text-sm leading-6" style={{ background: '#f7e8d3', color: '#7e4720' }}>
              Orders marked as <strong style={{ color: '#3b2010' }}>Paid</strong> or{' '}
              <strong style={{ color: '#3b2010' }}>Completed</strong> are included in revenue.
            </div>
          </div>

          {/* Payment method breakdown */}
          <div className="café-card p-6">
            <p className="section-label">Payment Methods</p>
            <h2 className="mt-1 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
              Revenue Breakdown
            </h2>
            <div className="mt-6 space-y-3">
              {['Cash', 'Card', 'UPI'].map((method) => (
                <div key={method}
                     className="flex items-center justify-between rounded-2xl p-4"
                     style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#3b2010' }}>{method}</p>
                    <p className="text-xs" style={{ color: '#a8602a' }}>
                      {orders.filter((o) => ['Paid', 'Completed'].includes(o.status) && o.paymentMethod === method).length} order(s)
                    </p>
                  </div>
                  <span className="rounded-2xl px-4 py-2 text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                    ₹{(summary.paymentMethodRevenue[method] || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status distribution */}
        <div className="café-card p-6">
          <p className="section-label">Order Status Summary</p>
          <h2 className="mt-1 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
            Status Distribution
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {['Paid', 'Completed', 'To Cook', 'Preparing', 'Draft'].map((status) => (
              <div key={status}
                   className="flex flex-col items-center rounded-2xl p-5 text-center"
                   style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                <p className="text-sm font-bold" style={{ color: '#3b2010' }}>{status}</p>
                <p className="mt-3 text-3xl font-bold" style={{ color: '#c97a34' }}>
                  {summary.statusCounts[status] || 0}
                </p>
                <span className={`mt-2 ${statusBadge[status] || 'badge-warm'}`}>orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders table */}
        <div className="café-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-label">Recent Orders</p>
              <h2 className="mt-1 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                Latest Activity
              </h2>
            </div>
            <button type="button" onClick={() => navigate('/orders')} className="btn-primary">
              View All Orders
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl p-10 text-center"
                 style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-medium" style={{ color: '#7e4720' }}>No orders yet. Create orders from POS.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border-2" style={{ borderColor: '#eecba0' }}>
              <table className="min-w-full divide-y text-left text-sm" style={{ '--tw-divide-opacity': 1 }}>
                <thead style={{ background: '#f7e8d3' }}>
                  <tr>
                    {['Order', 'Table', 'Status', 'Total', 'Payment', 'Date'].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#a8602a' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ background: '#fff', borderColor: '#eecba0' }}>
                  {recentOrders.map((order) => (
                    <tr key={order.orderNumber} style={{ borderColor: '#f7e8d3' }}
                        className="hover:bg-[#fdf6ee] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-xs" style={{ color: '#3b2010' }}>{order.orderNumber}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#5a3218' }}>{order.tableNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className={statusBadge[order.status] || 'badge-warm'}>{order.status}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold" style={{ color: '#c97a34' }}>₹{order.total.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#5a3218' }}>{order.paymentMethod || '—'}</td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: '#a8602a' }}>{order.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
