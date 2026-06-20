import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-sky-100 text-sky-700',
  'To Cook': 'bg-amber-100 text-amber-700',
  Preparing: 'bg-violet-100 text-violet-700',
  Draft: 'bg-slate-100 text-slate-700',
};

export default function Dashboard() {
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
    setOrders(parseJSON('restaurant_orders'));
  }, []);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((order) => order.status === 'Completed').length;
    const paidOrders = orders.filter((order) => order.status === 'Paid').length;
    const revenueOrders = orders.filter((order) => ['Paid', 'Completed'].includes(order.status));
    const revenue = revenueOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});

    const paymentMethodRevenue = orders.reduce((acc, order) => {
      if (['Paid', 'Completed'].includes(order.status) && order.paymentMethod) {
        acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
      }
      return acc;
    }, {});

    return {
      totalOrders,
      completedOrders,
      paidOrders,
      revenue,
      averageOrderValue,
      statusCounts,
      paymentMethodRevenue,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aTimestamp = Number(a.orderNumber?.split('-')[1]) || new Date(a.createdAt).getTime();
        const bTimestamp = Number(b.orderNumber?.split('-')[1]) || new Date(b.createdAt).getTime();
        return bTimestamp - aTimestamp;
      })
      .slice(0, 6);
  }, [orders]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Restaurant POS</p>
              <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Select Table
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Overview of the latest restaurant performance, recent orders, and status summary. All data is read directly from local storage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Orders</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">{summary.totalOrders}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Revenue</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">₹{summary.revenue.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Average Order Value</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">₹{summary.averageOrderValue.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Paid Orders</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">{summary.paidOrders}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Revenue Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order Revenue</h2>
              </div>
              <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Live</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Paid / Completed</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">₹{summary.revenue.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Paid Orders</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{summary.paidOrders}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-100 p-5 text-sm leading-6 text-slate-600">
              Orders marked as <span className="font-semibold text-slate-900">Paid</span> or <span className="font-semibold text-slate-900">Completed</span> are included in the revenue summary.
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Payment Methods</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Revenue breakdown</h2>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {['Cash', 'Card', 'UPI'].map((method) => (
                <div key={method} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{method}</p>
                    <p className="text-sm text-slate-600">
                      {orders.filter((o) => ['Paid', 'Completed'].includes(o.status) && o.paymentMethod === method).length} order(s)
                    </p>
                  </div>
                  <span className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    ₹{(summary.paymentMethodRevenue[method] || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order Status Summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status distribution</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {['Paid', 'Completed', 'To Cook', 'Preparing', 'Draft'].map((status) => (
              <div key={status} className="flex flex-col items-center rounded-3xl bg-slate-50 p-4 text-center">
                <p className="text-sm font-semibold text-slate-900">{status}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.statusCounts[status] || 0}</p>
                <span className={`mt-2 rounded-2xl px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                  order(s)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent Orders</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest activity</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View all orders
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
              No orders are available yet. Create orders from the POS to populate the dashboard.
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Order</th>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Table</th>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Total</th>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Payment</th>
                    <th className="px-6 py-4 uppercase tracking-[0.2em]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.orderNumber} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-slate-600">{order.tableNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-slate-100 text-slate-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900">₹{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600">{order.paymentMethod || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">{order.createdAt}</td>
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
