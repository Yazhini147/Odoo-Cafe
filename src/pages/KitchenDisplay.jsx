// ── KitchenDisplay — warm brown café theme ───────────────────────────────────
// Nandu Hackathon Update
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

const statuses = ['To Cook', 'Preparing', 'Completed'];

const columnConfig = {
  'To Cook':  { bg: '#fdf6ee', border: '#eecba0', badgeBg: '#fae8c0',  badgeColor: '#7e4720', icon: '🍳', label: 'To Cook' },
  Preparing:  { bg: '#eff6ff', border: '#bfdbfe', badgeBg: '#dbeafe',  badgeColor: '#1e40af', icon: '⏳', label: 'Preparing' },
  Completed:  { bg: '#f0fdf4', border: '#bbf7d0', badgeBg: '#dcfce7',  badgeColor: '#166534', icon: '✅', label: 'Completed' },
};

export default function KitchenDisplay() {
  useAuthGuard('Employee');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const parseJSON = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };

  useEffect(() => {
    const loadedOrders = parseJSON('restaurant_orders');
    console.log('🔍 KITCHEN LOADED ORDERS:', loadedOrders);
    console.log('🔍 STORAGE KEY READ:', localStorage.getItem('restaurant_orders'));
    setOrders(loadedOrders);

    const handleStorageChange = () => {
      const updatedOrders = parseJSON('restaurant_orders');
      console.log('🔄 KITCHEN STORAGE UPDATED (cross-tab):', updatedOrders.length, 'orders');
      setOrders(updatedOrders);
    };
    window.addEventListener('storage', handleStorageChange);

    const pollInterval = setInterval(() => {
      const currentOrders = parseJSON('restaurant_orders');
      setOrders((prevOrders) => {
        if (JSON.stringify(prevOrders) !== JSON.stringify(currentOrders)) {
          console.log('🔄 KITCHEN STORAGE UPDATED (polling):', currentOrders.length, 'orders');
        }
        return currentOrders;
      });
    }, 1000);

    return () => { window.removeEventListener('storage', handleStorageChange); clearInterval(pollInterval); };
  }, []);

  const statusBuckets = useMemo(
    () => statuses.reduce((acc, status) => { acc[status] = orders.filter((o) => o.status === status); return acc; }, {}),
    [orders]
  );

  const handleCardClick = (order) => {
    const nextStatus = order.status === 'To Cook' ? 'Preparing' : 'Completed';
    const updatedOrders = orders.map((item) =>
      item.orderNumber === order.orderNumber ? { ...item, status: nextStatus } : item
    );
    console.log('📋 KITCHEN UPDATE STATUS:', order.orderNumber, '→', nextStatus);
    setOrders(updatedOrders);
    localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
    console.log('📋 KITCHEN SAVED:', updatedOrders.length, 'orders');
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="café-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
                   style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                👨‍🍳
              </div>
              <div>
                <p className="section-label">Kitchen Display</p>
                <h1 className="text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Kitchen Dashboard
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/pos')} className="btn-outline">
                ← Back to POS
              </button>
              <button type="button" onClick={() => navigate('/tables')} className="btn-primary">
                Table Selection
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm" style={{ color: '#7e4720' }}>
            Click a card to advance its status. Orders auto-refresh every second.
          </p>
        </div>

        {/* Kanban columns */}
        <div className="grid gap-5 xl:grid-cols-3">
          {statuses.map((status) => {
            const cfg = columnConfig[status];
            return (
              <section key={status}
                className="rounded-3xl border-2 p-5 shadow-coffee-sm"
                style={{ background: cfg.bg, borderColor: cfg.border }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cfg.icon}</span>
                    <h2 className="text-base font-bold" style={{ color: '#3b2010' }}>{cfg.label}</h2>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{ background: cfg.badgeBg, color: cfg.badgeColor }}>
                    {statusBuckets[status].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusBuckets[status].length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed p-6 text-center text-sm"
                         style={{ borderColor: cfg.border, color: cfg.badgeColor, opacity: 0.7 }}>
                      No orders here
                    </div>
                  ) : (
                    statusBuckets[status].map((order) => (
                      <button
                        key={order.orderNumber}
                        type="button"
                        onClick={() => handleCardClick(order)}
                        className="w-full rounded-2xl border-2 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-coffee-md"
                        style={{ borderColor: cfg.border }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a8602a' }}>
                            {order.orderNumber}
                          </p>
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                                style={{ background: cfg.badgeBg, color: cfg.badgeColor }}>
                            {order.tableNumber}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs" style={{ color: '#7e4720' }}>Total</p>
                          <p className="text-lg font-bold" style={{ color: '#3b2010' }}>₹{order.total.toFixed(2)}</p>
                        </div>
                        {status !== 'Completed' && (
                          <p className="mt-2 text-[10px] font-medium" style={{ color: cfg.badgeColor }}>
                            Tap to advance →
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
