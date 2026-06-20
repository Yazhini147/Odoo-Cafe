import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import OrderSummary from '../components/OrderSummary';

const productList = [
  { id: 1, name: 'Burger', price: 120, category: 'Meals' },
  { id: 2, name: 'Pizza', price: 250, category: 'Meals' },
  { id: 3, name: 'Coffee', price: 80, category: 'Beverages' },
  { id: 4, name: 'Tea', price: 40, category: 'Beverages' },
  { id: 5, name: 'Sandwich', price: 100, category: 'Snacks' },
  { id: 6, name: 'Ice Cream', price: 90, category: 'Desserts' },
];

const categories = ['All', 'Beverages', 'Snacks', 'Meals', 'Desserts'];

const parseJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export default function POS({ tableNumber, selectedCustomer }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);

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
  }, [selectedCategory, searchTerm]);

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
    localStorage.setItem('restaurant_orders', JSON.stringify([order, ...existingOrders]));

    alert('Order Sent To Kitchen');
    setCartItems([]);
  };

  const handlePayment = (method) => {
    if (cartItems.length === 0) {
      alert('Add items to the cart before payment.');
      return;
    }

    const order = {
      orderNumber: `ORD-${Date.now()}`,
      tableNumber,
      items: cartItems,
      total: totalAmount,
      status: 'Paid',
      paymentMethod: method,
      createdAt: new Date().toLocaleString(),
    };

    const existingOrders = parseJSON('restaurant_orders');
    localStorage.setItem('restaurant_orders', JSON.stringify([order, ...existingOrders]));

    alert('Payment Successful');
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Navbar
          employeeName="Alex Doe"
          tableNumber={tableNumber}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
        />

        <div className="rounded-3xl bg-white/90 px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current Table</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {tableNumber ? tableNumber : 'No table selected'}
          </h2>
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
            <OrderSummary subtotal={subtotal} discount={0} onPay={handlePayment} selectedCustomer={selectedCustomer} />
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
    </div>
  );
}
