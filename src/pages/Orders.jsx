// ── Orders — warm brown café theme ───────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

export default function Orders() {
  useAuthGuard('Employee');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const parseJSON = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };

  useEffect(() => { setOrders(parseJSON('restaurant_orders')); }, []);

  const badgeStyle = (status) => {
    if (status === 'Paid') return 'badge-green';
    if (status === 'Draft') return 'badge-warm';
    return 'badge-amber';
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="café-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
                   style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                📋
              </div>
              <div>
                <p className="section-label">Odoo Cafe</p>
                <h1 className="text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Orders
                </h1>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/tables')} className="btn-primary">
              Back to Tables
            </button>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="café-card p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-base font-semibold" style={{ color: '#5a3218' }}>No orders found</p>
            <p className="text-sm mt-1" style={{ color: '#a8602a' }}>
              Send an order to kitchen to populate this list.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {orders.map((order) => (
              <article key={order.orderNumber} className="café-card p-6 hover:shadow-coffee-md transition-shadow">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="section-label text-[10px]">{order.orderNumber}</p>
                    <h2 className="mt-1 text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                      {order.tableNumber}
                    </h2>
                  </div>
                  <span className={badgeStyle(order.status)}>{order.status}</span>
                </div>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl p-4" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                    <p className="section-label text-[9px]">Total Amount</p>
                    <p className="mt-1.5 text-xl font-bold" style={{ color: '#c97a34' }}>₹{order.total.toFixed(2)}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                    <p className="section-label text-[9px]">Date</p>
                    <p className="mt-1.5 text-sm font-semibold" style={{ color: '#3b2010' }}>{order.createdAt}</p>
                  </div>
                  {order.paymentMethod && (
                    <div className="rounded-2xl p-4 sm:col-span-2" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                      <p className="section-label text-[9px]">Payment Method</p>
                      <p className="mt-1.5 text-sm font-semibold" style={{ color: '#3b2010' }}>{order.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
