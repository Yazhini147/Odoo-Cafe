// ── POS — warm brown café theme ──────────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import OrderSummary from '../components/OrderSummary';
import useAuthGuard from '../hooks/useAuthGuard';

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Burger',    price: 120, category: 'Meals',      image: '/images/burger.jpg' },
  { id: 2, name: 'Pizza',     price: 250, category: 'Meals',      image: '/images/pizza.jpg' },
  { id: 3, name: 'Coffee',    price: 80,  category: 'Beverages',  image: '/images/coffee.jpg' },
  { id: 4, name: 'Tea',       price: 40,  category: 'Beverages',  image: '/images/tea.jpg' },
  { id: 5, name: 'Sandwich',  price: 100, category: 'Snacks',     image: '/images/sandwich.jpg' },
  { id: 6, name: 'Ice Cream', price: 90,  category: 'Desserts',   image: '/images/icecream.jpg' },
];

const parseJSON = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;
  const taxRate = 0.05;
  const subtotal = receipt.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * taxRate).toFixed(2));

  return (
    <>
      <style>{`@media print { body > * { display:none !important; } #receipt-printable { display:block !important; position:static !important; } }`}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div id="receipt-printable"
             className="w-full max-w-sm rounded-3xl p-8 shadow-coffee-lg"
             style={{ background: '#fff' }}>
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-coffee-sm"
                 style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
              ☕
            </div>
            <p className="section-label text-[9px]">Receipt</p>
            <h2 className="mt-1 text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
              Odoo Cafe
            </h2>
          </div>

          {/* Meta */}
          <div className="mb-5 space-y-2 rounded-2xl p-4 text-sm" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
            {[
              { label: 'Order No.',    value: receipt.orderNumber },
              { label: 'Table',        value: receipt.tableNumber },
              { label: 'Date & Time',  value: receipt.paymentTime },
              { label: 'Payment',      value: receipt.paymentMethod },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span style={{ color: '#a8602a' }}>{label}</span>
                <span className="font-semibold" style={{ color: '#3b2010' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="mb-5">
            <p className="section-label text-[9px] mb-3">Items</p>
            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: '#5a3218' }}>
                    {item.name} <span style={{ color: '#a8602a' }}>×{item.quantity}</span>
                  </span>
                  <span className="font-semibold" style={{ color: '#3b2010' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mb-5 space-y-2 border-t pt-4 text-sm" style={{ borderColor: '#eecba0' }}>
            <div className="flex justify-between" style={{ color: '#7e4720' }}>
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: '#7e4720' }}>
              <span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold" style={{ color: '#3b2010' }}>
              <span>Total</span><span style={{ color: '#c97a34' }}>₹{receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="mb-5 text-center text-xs" style={{ color: '#a8602a' }}>
            Thank you for dining with us! ☕
          </p>

          <div className="flex gap-3 print:hidden">
            <button type="button" onClick={() => window.print()}
              className="flex-1 rounded-2xl py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#3b2010,#7e4720)' }}>
              Print Receipt
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-3">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── UPI QR Modal ──────────────────────────────────────────────────────────────
function UpiQrModal({ amount, upiId, onConfirm, onClose }) {
  if (!upiId) return null;
  const upiUrl = `upi://pay?pa=${upiId}&pn=Odoo%20Cafe&am=${amount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl p-8 shadow-coffee-lg text-center space-y-5"
           style={{ background: '#fff' }}>
        <h3 className="text-xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
          Scan & Pay
        </h3>
        <p className="text-sm" style={{ color: '#7e4720' }}>
          Scan this QR code to pay <strong style={{ color: '#c97a34' }}>₹{amount.toFixed(2)}</strong>
        </p>
        <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl p-2 border-2"
             style={{ background: '#fdf6ee', borderColor: '#eecba0' }}>
          <img src={qrCodeUrl} alt="UPI QR Code" className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="section-label text-[9px]">UPI ID</p>
          <p className="text-sm font-semibold mt-1" style={{ color: '#3b2010' }}>{upiId}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onConfirm}
            className="flex-1 rounded-2xl py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#059669,#065f46)' }}>
            Confirm Paid
          </button>
          <button type="button" onClick={onClose} className="btn-outline flex-1 py-3">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── POS Page ──────────────────────────────────────────────────────────────────
export default function POS({ tableNumber, selectedCustomer }) {
  useAuthGuard('Employee');
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [productList, setProductList] = useState(DEFAULT_PRODUCTS);
  const [receipt, setReceipt] = useState(null);
  const [upiModalData, setUpiModalData] = useState(null);
  const [activeOrder, setActiveOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('active_order')) || null; } catch { return null; }
  });

  useEffect(() => {
    const saved = parseJSON('products');
    setProductList(saved.length > 0 ? saved : DEFAULT_PRODUCTS);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(productList.map((p) => p.category))];
    return ['All', ...unique];
  }, [productList]);

  useEffect(() => { if (!tableNumber) navigate('/tables'); }, [navigate, tableNumber]);
  if (!tableNumber) return null;

  const filteredProducts = useMemo(() =>
    productList.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    }), [selectedCategory, searchTerm, productList]);

  const handleAddToCart = (product) =>
    setCartItems((cur) => {
      const ex = cur.find((i) => i.id === product.id);
      if (ex) return cur.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...cur, { ...product, quantity: 1 }];
    });

  const handleIncrease = (id) => setCartItems((cur) => cur.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const handleDecrease = (id) => setCartItems((cur) => cur.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  const handleRemove   = (id) => setCartItems((cur) => cur.filter((i) => i.id !== id));

  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
  const tax = subtotal * 0.05;
  const totalAmount = parseFloat((subtotal + tax).toFixed(2));

  const handleSendToKitchen = () => {
    if (cartItems.length === 0) { alert('Add items to the cart before sending the order.'); return; }
    const order = {
      orderNumber: `ORD-${Date.now()}`, tableNumber, items: cartItems,
      total: totalAmount, status: 'To Cook', createdAt: new Date().toLocaleString(),
    };
    const allOrders = [order, ...parseJSON('restaurant_orders')];
    localStorage.setItem('restaurant_orders', JSON.stringify(allOrders));
    localStorage.setItem('active_order', JSON.stringify(order));
    setActiveOrder(order);
    alert('Order Sent To Kitchen');
    setCartItems([]);
  };

  const completePayment = (method, unpaidOrder, existingOrders) => {
    const paymentTime = new Date().toLocaleString();
    const updatedOrders = existingOrders.map((o) =>
      o.orderNumber === unpaidOrder.orderNumber
        ? { ...o, paymentStatus: 'Paid', paymentMethod: method, paymentTime }
        : o
    );
    localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
    setReceipt({ orderNumber: unpaidOrder.orderNumber, tableNumber: unpaidOrder.tableNumber,
      items: unpaidOrder.items, total: unpaidOrder.total, paymentMethod: method, paymentTime });
    setCartItems([]);
    localStorage.removeItem('active_order');
    setActiveOrder(null);
  };

  const handlePayment = (method) => {
    const existingOrders = parseJSON('restaurant_orders');
    const tableOrders = existingOrders.filter((o) => o.tableNumber === tableNumber);
    const unpaidOrder = tableOrders.find((o) => o.paymentStatus !== 'Paid');
    if (!unpaidOrder) { alert('Please send items to kitchen first before completing payment.'); return; }
    if (method === 'UPI QR') {
      let settings = { upiId: 'cafe@ybl' };
      try { const s = localStorage.getItem('payment_settings'); if (s) settings = JSON.parse(s); } catch {}
      setUpiModalData({ amount: unpaidOrder.total, upiId: settings.upiId, unpaidOrder, existingOrders });
    } else {
      completePayment(method, unpaidOrder, existingOrders);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl space-y-5">
        <Navbar tableNumber={tableNumber} searchValue={searchTerm} onSearch={setSearchTerm} />

        {/* Table banner */}
        <div className="café-card flex items-center justify-between px-6 py-5">
          <div>
            <p className="section-label">Current Table</p>
            <h2 className="mt-1.5 text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
              {tableNumber || 'No table selected'}
            </h2>
          </div>
          <button type="button" onClick={() => navigate('/tables')} className="btn-outline">
            ← Back to Tables
          </button>
        </div>

        {/* Main grid */}
        <main className="grid gap-5 xl:grid-cols-[30%_40%_30%]">

          {/* Left: categories + product grid */}
          <section className="space-y-5">
            {/* Categories */}
            <div className="café-card p-5">
              <h2 className="text-sm font-bold mb-3" style={{ color: '#3b2010' }}>Menu Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                    style={selectedCategory === cat
                      ? { background: 'linear-gradient(135deg,#3b2010,#7e4720)', color: '#fff' }
                      : { background: '#f7e8d3', color: '#7e4720' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
              ))}
            </div>
          </section>

          {/* Centre: Cart */}
          <Cart
            cartItems={cartItems}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />

          {/* Right: Order summary + kitchen button */}
          <div className="space-y-5">
            {(() => {
              const taxRate = 0.05;
              const displaySubtotal = cartItems.length > 0
                ? subtotal
                : activeOrder ? parseFloat((activeOrder.total / (1 + taxRate)).toFixed(2)) : 0;
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
              disabled={cartItems.length === 0}
              className="w-full rounded-3xl py-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: cartItems.length > 0 ? 'linear-gradient(135deg,#059669,#065f46)' : undefined }}
            >
              🍳 Send To Kitchen
            </button>
          </div>
        </main>
      </div>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      {upiModalData && (
        <UpiQrModal
          amount={upiModalData.amount}
          upiId={upiModalData.upiId}
          onConfirm={() => { completePayment('UPI QR', upiModalData.unpaidOrder, upiModalData.existingOrders); setUpiModalData(null); }}
          onClose={() => setUpiModalData(null)}
        />
      )}
    </div>
  );
}
