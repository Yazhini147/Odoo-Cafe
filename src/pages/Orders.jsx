import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
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

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Odoo Cafe</p>
              <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
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

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm shadow-slate-200/80">
            No orders found. Send an order to kitchen to populate this list.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {orders.map((order) => (
              <article key={order.orderNumber} className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/80">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{order.orderNumber}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{order.tableNumber}</h2>
                  </div>
                  <span className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Draft' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Amount</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Date</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{order.createdAt}</p>
                  </div>
                  {order.paymentMethod && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{order.paymentMethod}</p>
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
