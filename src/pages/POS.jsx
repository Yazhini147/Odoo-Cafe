import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import OrderSummary from '../components/OrderSummary';

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Burger', price: 120, category: 'Meals' },
  { id: 2, name: 'Pizza', price: 250, category: 'Meals' },
  { id: 3, name: 'Coffee', price: 80, category: 'Beverages' },
  { id: 4, name: 'Tea', price: 40, category: 'Beverages' },
  { id: 5, name: 'Sandwich', price: 100, category: 'Snacks' },
  { id: 6, name: 'Ice Cream', price: 90, category: 'Desserts' },
];

const parseJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  const taxRate = 0.05;
  const subtotal = receipt.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * taxRate).toFixed(2));

  return (
    <>
      {/* Print styles — hides everything except the modal */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #receipt-printable { display: block !important; position: static !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        {/* Receipt card */}
        <div
          id="receipt-printable"
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-500 text-2xl font-bold text-white shadow-md shadow-amber-300/40">
              R
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Receipt</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Odoo Cafe</h2>
          </div>

          {/* Meta */}
          <div className="mb-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Order No.</span>
              <span className="font-semibold text-slate-900">{receipt.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Table</span>
              <span className="font-semibold text-slate-900">{receipt.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date &amp; Time</span>
              <span className="font-semibold text-slate-900">{receipt.paymentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="font-semibold text-slate-900">{receipt.paymentMethod}</span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Items</p>
            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-700">
                    {item.name}
                    <span className="ml-1 text-slate-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mb-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (5%)</span>
              <span>Rs.{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>Rs.{receipt.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Thank you */}
          <p className="mb-6 text-center text-xs text-slate-400">
            Thank you for dining with us!
          </p>

          {/* Action buttons — hidden when printing */}
          <div className="flex gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── POS Page ──────────────────────────────────────────────────────────────────
export default function POS({ tableNumber, selectedCustomer }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [productList, setProductList] = useState(DEFAULT_PRODUCTS);
  const [receipt, setReceipt] = useState(null);
  // activeOrder persists across navigation via localStorage
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('active_order')) || null;
    } catch {
      return null;
    }
  });

  // Load products from localStorage (Admin-managed), fall back to defaults
  useEffect(() => {
    const saved = parseJSON('products');
    setProductList(saved.length > 0 ? saved : DEFAULT_PRODUCTS);
  }, []);

  // Derive category list dynamically from the loaded products
  const categories = useMemo(() => {
    const unique = [...new Set(productList.map((p) => p.category))];
    return ['All', ...unique];
  }, [productList]);

  useEffect(() => {
    if (!tableNumber) {
      navigate('/');
    }
  }, [navigate, tableNumber]);

  if (!tableNumber) {
    return null;
  }

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, productList]);

  const handleAddToCart = (product) => {
    setCartItems((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const handleIncrease = (id) => {
    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (id) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const totalAmount = parseFloat((subtotal + tax).toFixed(2));

  const handleSendToKitchen = () => {
    if (cartItems.length === 0) {
      alert('Add items to the cart before sending the order.');
      return;
    }

    const order = {
      orderNumber: `ORD-${Date.now()}`,
      tableNumber,
      items: cartItems,
      total: totalAmount,
      status: 'To Cook',
      createdAt: new Date().toLocaleString(),
    };

    const existingOrders = parseJSON('restaurant_orders');
    const allOrders = [order, ...existingOrders];
    localStorage.setItem('restaurant_orders', JSON.stringify(allOrders));

    // Persist order so it survives navigation to Kitchen and back
    localStorage.setItem('active_order', JSON.stringify(order));
    setActiveOrder(order);
    alert('Order Sent To Kitchen');
    setCartItems([]);
  };

  const handlePayment = (method) => {
    const existingOrders = parseJSON('restaurant_orders');

    // Find the most recent unpaid order for this table
    const tableOrders = existingOrders.filter((o) => o.tableNumber === tableNumber);
    const unpaidOrder = tableOrders.find((o) => o.paymentStatus !== 'Paid');

    if (!unpaidOrder) {
      alert('Please send items to kitchen first before completing payment.');
      return;
    }

    const paymentTime = new Date().toLocaleString();

    // ONLY update payment fields — never touch `status` (kitchen workflow)
    const updatedOrders = existingOrders.map((o) =>
      o.orderNumber === unpaidOrder.orderNumber
        ? {
            ...o,
            paymentStatus: 'Paid',
            paymentMethod: method,
            paymentTime,
          }
        : o
    );

    localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));

    // Show receipt modal
    setReceipt({
      orderNumber: unpaidOrder.orderNumber,
      tableNumber: unpaidOrder.tableNumber,
      items: unpaidOrder.items,
      total: unpaidOrder.total,
      paymentMethod: method,
      paymentTime,
    });

    setCartItems([]);
    localStorage.removeItem('active_order'); // remove after payment
    setActiveOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Navbar
          employeeName="Ram"
          tableNumber={tableNumber}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
        />

        <div className="flex items-center justify-between rounded-3xl bg-white/90 px-6 py-5 shadow-sm shadow-slate-200/70">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current Table</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {tableNumber ? tableNumber : 'No table selected'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ← Back to Tables
          </button>
        </div>

        <main className="grid gap-6 xl:grid-cols-[30%_40%_30%]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
              <h2 className="text-lg font-semibold text-slate-900">Menu Categories</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
              ))}
            </div>
          </section>

          <Cart
            cartItems={cartItems}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />

          <div className="space-y-6">
            {/* When cart is empty but an order is pending payment, show the saved order total */}
            {(() => {
              const taxRate = 0.05;
              const displaySubtotal =
                cartItems.length > 0
                  ? subtotal
                  : activeOrder
                  ? parseFloat((activeOrder.total / (1 + taxRate)).toFixed(2))
                  : 0;
              return (
                <OrderSummary
                  subtotal={displaySubtotal}
                  discount={0}
                  onPay={handlePayment}
                  selectedCustomer={selectedCustomer}
                />
              );
            })()}
            <button
              type="button"
              onClick={handleSendToKitchen}
              className="w-full rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={cartItems.length === 0}
            >
              Send To Kitchen
            </button>
          </div>
        </main>
      </div>

      {/* Receipt modal — rendered after successful payment */}
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}
