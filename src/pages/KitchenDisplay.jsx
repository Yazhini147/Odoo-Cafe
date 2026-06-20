import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statuses = ['To Cook', 'Preparing', 'Completed'];
const columnStyles = {
  'To Cook': 'bg-amber-50 border-amber-200',
  Preparing: 'bg-sky-50 border-sky-200',
  Completed: 'bg-emerald-50 border-emerald-200',
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const parseJSON = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadedOrders = parseJSON('restaurant_orders');
    console.log('🔍 KITCHEN LOADED ORDERS:', loadedOrders);
    console.log('🔍 STORAGE KEY READ:', localStorage.getItem('restaurant_orders'));
    setOrders(loadedOrders);

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      const updatedOrders = parseJSON('restaurant_orders');
      console.log('🔄 KITCHEN STORAGE UPDATED (cross-tab):', updatedOrders.length, 'orders');
      setOrders(updatedOrders);
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll for same-window updates (since storage event doesn't fire in same window)
    const pollInterval = setInterval(() => {
      const currentOrders = parseJSON('restaurant_orders');
      setOrders((prevOrders) => {
        const prevJSON = JSON.stringify(prevOrders);
        const currentJSON = JSON.stringify(currentOrders);
        if (prevJSON !== currentJSON) {
          console.log('🔄 KITCHEN STORAGE UPDATED (polling):', currentOrders.length, 'orders');
        }
        return currentOrders;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  const statusBuckets = useMemo(
    () =>
      statuses.reduce((acc, status) => {
        acc[status] = orders.filter((order) => order.status === status);
        return acc;
      }, {}),
    [orders]
  );

  const handleCardClick = (order) => {
    const nextStatus =
      order.status === 'To Cook'
        ? 'Preparing'
        : order.status === 'Preparing'
        ? 'Completed'
        : 'Completed';

    const updatedOrders = orders.map((item) =>
      item.orderNumber === order.orderNumber ? { ...item, status: nextStatus } : item
    );

    console.log('📋 KITCHEN UPDATE STATUS:', order.orderNumber, '→', nextStatus);
    setOrders(updatedOrders);
    localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
    console.log('📋 KITCHEN SAVED:', updatedOrders.length, 'orders');
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Kitchen Display</p>
              <h1 className="text-3xl font-semibold text-slate-900">Kitchen Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to Table Selection
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {statuses.map((status) => (
            <section
              key={status}
              className={`rounded-3xl border p-6 ${columnStyles[status]} shadow-sm shadow-slate-200/70`}
            >
              <h2 className="mb-4 text-lg font-semibold text-slate-900">{status}</h2>
              <div className="space-y-4">
                {statusBuckets[status].length === 0 ? (
                  <p className="rounded-3xl bg-white/80 p-4 text-sm text-slate-500">No orders.</p>
                ) : (
                  statusBuckets[status].map((order) => (
                    <button
                      key={order.orderNumber}
                      type="button"
                      onClick={() => handleCardClick(order)}
                      className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{order.orderNumber}</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {order.tableNumber}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="text-lg font-semibold text-slate-900">₹{order.total.toFixed(2)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
