import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../hooks/useAuthGuard';

const parseJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const defaultTables = [
  { id: 1, number: 'Table 1', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 2, number: 'Table 2', seats: 4, status: 'Occupied', floor: 'Ground Floor' },
  { id: 3, number: 'Table 3', seats: 2, status: 'Available', floor: 'Ground Floor' },
  { id: 4, number: 'Table 4', seats: 4, status: 'Occupied', floor: 'First Floor' },
  { id: 5, number: 'Table 5', seats: 6, status: 'Available', floor: 'First Floor' },
  { id: 6, number: 'Table 6', seats: 4, status: 'Available', floor: 'First Floor' },
];

export default function Admin() {
  useAuthGuard('Admin');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  // ✅ Initialize synchronously — no race condition with useEffect
  const [products, setProducts] = useState(() => parseJSON('products'));
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const UNITS = ['Per Piece', 'Per Kg', 'Per Litre', 'Per Plate', 'Per Glass'];
  const TAXES = ['0%', '5%', '12%', '18%'];

  const [productForm, setProductForm] = useState({
    name: '', price: '', category: '', unitOfMeasure: '', tax: '', description: '', image: '',
  });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [tableForm, setTableForm] = useState({ number: '', seats: '', floor: '' });

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const [paymentSettings, setPaymentSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('payment_settings');
      return stored ? JSON.parse(stored) : { cash: true, card: true, upi: true, upiId: 'cafe@ybl' };
    } catch {
      return { cash: true, card: true, upi: true, upiId: 'cafe@ybl' };
    }
  });

  const handleSavePaymentSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('payment_settings', JSON.stringify(paymentSettings));
    alert('Payment settings saved successfully!');
    console.log('Payment settings saved by Admin:', paymentSettings);
  };

  useEffect(() => {
    // Merge categories from both keys so existing data isn't lost
    const admin = parseJSON('admin_categories').map((c) => (typeof c === 'string' ? c : c.name));
    const shared = parseJSON('categories');
    const merged = [...new Set([...admin, ...shared])];
    setCategories(merged);

    // Sync tables with 'tables' key in localStorage
    const storedTables = parseJSON('tables');
    if (storedTables.length === 0) {
      setTables(defaultTables);
      localStorage.setItem('tables', JSON.stringify(defaultTables));
      console.log('Admin: Initialized tables with defaultTables', defaultTables);
    } else {
      setTables(storedTables);
      console.log('Admin: Loaded tables from localStorage key "tables"', storedTables);
    }
  }, []);

  let displayName = 'Admin';
  let roleLabel = 'ADMIN';
  try {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      const userObj = JSON.parse(stored);
      roleLabel = userObj.role ? userObj.role.toUpperCase() : 'ADMIN';
      const usersList = JSON.parse(localStorage.getItem('users')) || [];
      const found = usersList.find((u) => u.username.toLowerCase() === userObj.username.toLowerCase());
      displayName = found ? found.name : userObj.username;
    }
  } catch {
    // fallback
  }

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    navigate('/');
  };

  // Product handlers
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.unitOfMeasure || !productForm.tax) {
      alert('Please fill all required product fields');
      return;
    }

    const newProduct = {
      id: editingId || Date.now(),
      name: productForm.name.trim(),
      price: parseFloat(productForm.price),
      category: productForm.category,
      unitOfMeasure: productForm.unitOfMeasure,
      tax: productForm.tax,
      description: productForm.description.trim(),
      image: productForm.image.trim(),
    };

    // ✅ Always read fresh from localStorage — guards against any stale closure
    const existingProducts = parseJSON('products');

    let updatedProducts;
    if (editingId) {
      updatedProducts = existingProducts.map((p) => (p.id === editingId ? newProduct : p));
    } else {
      updatedProducts = [...existingProducts, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProductForm({ name: '', price: '', category: '', unitOfMeasure: '', tax: '', description: '', image: '' });
    setEditingId(null);
    setEditingType(null);
    alert(editingId ? 'Product updated' : 'Product added');
  };

  const handleSaveNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (!categories.includes(name)) {
      const updated = [...categories, name];
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
    }
    setProductForm((f) => ({ ...f, category: name }));
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      unitOfMeasure: product.unitOfMeasure || '',
      tax: product.tax || '',
      description: product.description || '',
      image: product.image || '',
    });
    setEditingId(product.id);
    setEditingType('product');
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  // Category handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert('Please enter category name');
      return;
    }

    const newCategory = {
      id: editingId || Date.now(),
      name: categoryForm.name,
    };

    let updatedCategories;
    if (editingId) {
      updatedCategories = categories.map((c) => (c.id === editingId ? newCategory : c));
    } else {
      updatedCategories = [...categories, newCategory];
    }

    setCategories(updatedCategories);
    localStorage.setItem('admin_categories', JSON.stringify(updatedCategories));
    setCategoryForm({ name: '' });
    setEditingId(null);
    setEditingType(null);
    alert(editingId ? 'Category updated' : 'Category added');
  };

  const handleEditCategory = (category) => {
    setCategoryForm({ name: category.name });
    setEditingId(category.id);
    setEditingType('category');
  };

  const handleDeleteCategory = (id) => {
    if (confirm('Delete this category?')) {
      const updatedCategories = categories.filter((c) => c.id !== id);
      setCategories(updatedCategories);
      localStorage.setItem('admin_categories', JSON.stringify(updatedCategories));
    }
  };

  // Table handlers
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!tableForm.number || !tableForm.seats || !tableForm.floor) {
      alert('Please fill all table fields');
      return;
    }

    const newTable = {
      id: editingId || Date.now(),
      number: tableForm.number,
      seats: parseInt(tableForm.seats),
      floor: tableForm.floor,
      status: 'Available',
    };

    let updatedTables;
    if (editingId) {
      updatedTables = tables.map((t) => (t.id === editingId ? newTable : t));
    } else {
      updatedTables = [...tables, newTable];
    }

    setTables(updatedTables);
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    console.log('Tables saved by Admin:', updatedTables);
    setTableForm({ number: '', seats: '', floor: '' });
    setEditingId(null);
    setEditingType(null);
    alert(editingId ? 'Table updated' : 'Table added');
  };

  const handleEditTable = (table) => {
    setTableForm({ number: table.number, seats: table.seats.toString(), floor: table.floor });
    setEditingId(table.id);
    setEditingType('table');
  };

  const handleDeleteTable = (id) => {
    if (confirm('Delete this table?')) {
      const updatedTables = tables.filter((t) => t.id !== id);
      setTables(updatedTables);
      localStorage.setItem('tables', JSON.stringify(updatedTables));
      console.log('Tables saved by Admin (delete):', updatedTables);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setProductForm({ name: '', price: '', category: '', unitOfMeasure: '', tax: '', description: '', image: '' });
    setCategoryForm({ name: '' });
    setTableForm({ number: '', seats: '', floor: '' });
    setShowNewCategory(false);
    setNewCategoryName('');
  };

  // ── shared field style helpers ──────────────────────────────────────────────
  const inputCls = 'café-input mt-2';
  const selectCls = 'café-select mt-2';
  const labelCls = 'block text-sm font-semibold';

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <div className="peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
           style={{ background: checked ? '#c97a34' : '#e2e8f0' }} />
    </label>
  );

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="café-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-coffee-sm"
                   style={{ background: 'linear-gradient(135deg,#c97a34,#7e4720)' }}>
                ⚙️
              </div>
              <div>
                <p className="section-label">Odoo Cafe</p>
                <h1 className="text-2xl font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl px-4 py-2.5 text-center" style={{ background: '#f7e8d3' }}>
                <p className="section-label text-[9px]">Logged In As</p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: '#3b2010' }}>{roleLabel}: {displayName}</p>
              </div>
              <button type="button" onClick={handleLogout}
                className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#b91c1c' }}>
                Logout
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6" style={{ color: '#7e4720' }}>
            Manage products, categories, tables and payment settings. All changes are saved to local storage.
          </p>
        </div>

        {/* ── Tab panel ───────────────────────────────────────────────────── */}
        <div className="café-card overflow-hidden">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 border-b p-5" style={{ borderColor: '#eecba0' }}>
            {['products', 'categories', 'tables', 'payments'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); cancelEdit(); }}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all"
                style={activeTab === tab
                  ? { background: 'linear-gradient(135deg,#3b2010,#7e4720)', color: '#fff' }
                  : { background: '#f7e8d3', color: '#7e4720' }
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ════ PRODUCTS TAB ═══════════════════════════════════════════ */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Form */}
                <div className="rounded-3xl p-6" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <h2 className="mb-5 text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                    {editingId && editingType === 'product' ? '✏️ Edit Product' : '+ Add New Product'}
                  </h2>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    {/* Name + Price */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls} style={{ color: '#5a3218' }}>Product Name <span className="text-rose-500">*</span></label>
                        <input type="text" value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g., Masala Dosa" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls} style={{ color: '#5a3218' }}>Price (₹) <span className="text-rose-500">*</span></label>
                        <input type="number" step="0.01" min="0" value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className={inputCls} />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>Category <span className="text-rose-500">*</span></label>
                      {!showNewCategory ? (
                        <div className="mt-2 flex gap-2">
                          <select value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className={selectCls + ' flex-1'} style={{ marginTop: 0 }}>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button type="button" onClick={() => setShowNewCategory(true)}
                            className="rounded-2xl border-2 border-dashed px-4 py-2 text-sm font-semibold transition whitespace-nowrap"
                            style={{ borderColor: '#eecba0', color: '#7e4720' }}>
                            + New
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 flex gap-2">
                          <input type="text" value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name" autoFocus className={inputCls + ' flex-1'} style={{ marginTop: 0 }} />
                          <button type="button" onClick={handleSaveNewCategory} className="btn-accent px-4">Save</button>
                          <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                            className="btn-outline px-4">Cancel</button>
                        </div>
                      )}
                    </div>

                    {/* Unit + Tax */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls} style={{ color: '#5a3218' }}>Unit of Measure <span className="text-rose-500">*</span></label>
                        <select value={productForm.unitOfMeasure}
                          onChange={(e) => setProductForm({ ...productForm, unitOfMeasure: e.target.value })}
                          className={selectCls}>
                          <option value="">Select unit</option>
                          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls} style={{ color: '#5a3218' }}>Tax <span className="text-rose-500">*</span></label>
                        <select value={productForm.tax}
                          onChange={(e) => setProductForm({ ...productForm, tax: e.target.value })}
                          className={selectCls}>
                          <option value="">Select tax rate</option>
                          {TAXES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>
                        Description <span className="font-normal" style={{ color: '#a8602a' }}>(optional)</span>
                      </label>
                      <textarea value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Short description" rows={2}
                        className={inputCls + ' resize-none'} />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>
                        Image URL <span className="font-normal" style={{ color: '#a8602a' }}>(optional — e.g. /images/burger.jpg)</span>
                      </label>
                      <div className="mt-2 flex gap-3 items-center">
                        <input type="text" value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="/images/burger.jpg or https://…" className="café-input flex-1" />
                        {productForm.image && (
                          <img src={productForm.image} alt="preview"
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                            style={{ border: '1.5px solid #eecba0' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                      <button type="submit" className="btn-primary flex-1 py-3">
                        {editingId ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingId && (
                        <button type="button" onClick={cancelEdit} className="btn-outline flex-1 py-3">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Product list */}
                {products.length === 0 ? (
                  <p className="rounded-2xl p-5 text-center text-sm" style={{ background: '#fdf6ee', color: '#a8602a' }}>
                    No products yet.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-2xl border-2" style={{ borderColor: '#eecba0' }}>
                    <table className="min-w-full divide-y text-left text-sm">
                      <thead style={{ background: '#f7e8d3' }}>
                        <tr>
                          {['Image', 'Name', 'Category', 'Price', 'Unit', 'Tax', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#a8602a' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ background: '#fff' }}>
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-[#fdf6ee] transition-colors border-t" style={{ borderColor: '#f7e8d3' }}>
                            <td className="px-4 py-3">
                              <img src={product.image || '/images/placeholder.png'} alt={product.name}
                                className="h-10 w-10 rounded-xl object-cover"
                                style={{ border: '1.5px solid #eecba0' }}
                                onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }} />
                            </td>
                            <td className="px-4 py-3 font-bold" style={{ color: '#3b2010' }}>
                              {product.name}
                              {product.description && (
                                <p className="text-xs font-normal mt-0.5" style={{ color: '#a8602a' }}>{product.description}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#5a3218' }}>{product.category}</td>
                            <td className="px-4 py-3 font-bold" style={{ color: '#c97a34' }}>₹{product.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm" style={{ color: '#5a3218' }}>{product.unitOfMeasure || '—'}</td>
                            <td className="px-4 py-3">
                              <span className="badge-warm text-[10px]">{product.tax || '—'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button type="button" onClick={() => handleEditProduct(product)}
                                  className="rounded-xl px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
                                  style={{ background: '#f7e8d3', color: '#3b2010' }}>Edit</button>
                                <button type="button" onClick={() => handleDeleteProduct(product.id)}
                                  className="rounded-xl px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
                                  style={{ background: '#fee2e2', color: '#b91c1c' }}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ════ CATEGORIES TAB ════════════════════════════════════════ */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="rounded-3xl p-6" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <h2 className="mb-5 text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                    {editingId && editingType === 'category' ? '✏️ Edit Category' : '+ Add New Category'}
                  </h2>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>Category Name</label>
                      <input type="text" value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ name: e.target.value })}
                        className={inputCls} />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary flex-1 py-3">
                        {editingId ? 'Update Category' : 'Add Category'}
                      </button>
                      {editingId && (
                        <button type="button" onClick={cancelEdit} className="btn-outline flex-1 py-3">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  {categories.length === 0 ? (
                    <p className="rounded-2xl p-4 text-center text-sm" style={{ background: '#fdf6ee', color: '#a8602a' }}>No categories yet.</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id}
                           className="flex items-center justify-between rounded-2xl border-2 bg-white p-4"
                           style={{ borderColor: '#eecba0' }}>
                        <p className="font-bold" style={{ color: '#3b2010' }}>{category.name}</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditCategory(category)}
                            className="rounded-xl px-4 py-2 text-sm font-bold transition hover:opacity-80"
                            style={{ background: '#f7e8d3', color: '#3b2010' }}>Edit</button>
                          <button type="button" onClick={() => handleDeleteCategory(category.id)}
                            className="rounded-xl px-4 py-2 text-sm font-bold transition hover:opacity-80"
                            style={{ background: '#fee2e2', color: '#b91c1c' }}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ════ TABLES TAB ════════════════════════════════════════════ */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="rounded-3xl p-6" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <h2 className="mb-5 text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                    {editingId && editingType === 'table' ? '✏️ Edit Table' : '+ Add New Table'}
                  </h2>
                  <form onSubmit={handleAddTable} className="space-y-4">
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>Table Number</label>
                      <input type="text" value={tableForm.number}
                        onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
                        placeholder="e.g., Table 7" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>Number of Seats</label>
                      <input type="number" value={tableForm.seats}
                        onChange={(e) => setTableForm({ ...tableForm, seats: e.target.value })}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#5a3218' }}>Floor</label>
                      <select value={tableForm.floor}
                        onChange={(e) => setTableForm({ ...tableForm, floor: e.target.value })}
                        className={selectCls}>
                        <option value="">Select Floor</option>
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="First Floor">First Floor</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary flex-1 py-3">
                        {editingId ? 'Update Table' : 'Add Table'}
                      </button>
                      {editingId && (
                        <button type="button" onClick={cancelEdit} className="btn-outline flex-1 py-3">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  {tables.length === 0 ? (
                    <p className="rounded-2xl p-4 text-center text-sm" style={{ background: '#fdf6ee', color: '#a8602a' }}>No tables yet.</p>
                  ) : (
                    tables.map((table) => (
                      <div key={table.id}
                           className="flex items-center justify-between rounded-2xl border-2 bg-white p-4"
                           style={{ borderColor: '#eecba0' }}>
                        <div>
                          <p className="font-bold" style={{ color: '#3b2010' }}>{table.number}</p>
                          <p className="text-sm" style={{ color: '#7e4720' }}>{table.seats} seats • {table.floor}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditTable(table)}
                            className="rounded-xl px-4 py-2 text-sm font-bold transition hover:opacity-80"
                            style={{ background: '#f7e8d3', color: '#3b2010' }}>Edit</button>
                          <button type="button" onClick={() => handleDeleteTable(table.id)}
                            className="rounded-xl px-4 py-2 text-sm font-bold transition hover:opacity-80"
                            style={{ background: '#fee2e2', color: '#b91c1c' }}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ════ PAYMENTS TAB ══════════════════════════════════════════ */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="rounded-3xl p-6" style={{ background: '#fdf6ee', border: '1.5px solid #eecba0' }}>
                  <h2 className="mb-5 text-lg font-bold" style={{ color: '#3b2010', fontFamily: "'Playfair Display', serif" }}>
                    💳 Payment Settings
                  </h2>
                  <form onSubmit={handleSavePaymentSettings} className="space-y-4 max-w-lg">

                    {/* Cash */}
                    <div className="flex items-center justify-between rounded-2xl border-2 bg-white p-4"
                         style={{ borderColor: '#eecba0' }}>
                      <div>
                        <p className="font-bold" style={{ color: '#3b2010' }}>Cash Payment</p>
                        <p className="text-xs mt-0.5" style={{ color: '#7e4720' }}>Enable cash transactions at POS checkout</p>
                      </div>
                      <Toggle checked={paymentSettings.cash}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, cash: e.target.checked })} />
                    </div>

                    {/* Card */}
                    <div className="flex items-center justify-between rounded-2xl border-2 bg-white p-4"
                         style={{ borderColor: '#eecba0' }}>
                      <div>
                        <p className="font-bold" style={{ color: '#3b2010' }}>Digital / Card Payment</p>
                        <p className="text-xs mt-0.5" style={{ color: '#7e4720' }}>Enable card swipe or digital wallet options</p>
                      </div>
                      <Toggle checked={paymentSettings.card}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, card: e.target.checked })} />
                    </div>

                    {/* UPI */}
                    <div className="rounded-2xl border-2 bg-white p-4 space-y-4" style={{ borderColor: '#eecba0' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold" style={{ color: '#3b2010' }}>UPI QR Code Payment</p>
                          <p className="text-xs mt-0.5" style={{ color: '#7e4720' }}>Enable UPI QR display for instant mobile payment</p>
                        </div>
                        <Toggle checked={paymentSettings.upi}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, upi: e.target.checked })} />
                      </div>
                      {paymentSettings.upi && (
                        <div className="border-t pt-4" style={{ borderColor: '#eecba0' }}>
                          <label className={labelCls} style={{ color: '#5a3218' }}>UPI ID / VPA</label>
                          <input type="text" value={paymentSettings.upiId}
                            onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                            placeholder="e.g. cafe@ybl" className={inputCls} />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn-primary w-full py-3.5">
                      Save Settings
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

