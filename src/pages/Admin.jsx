import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const parseJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);

  const [productForm, setProductForm] = useState({ name: '', price: '', category: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [tableForm, setTableForm] = useState({ number: '', seats: '', floor: '' });

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    setProducts(parseJSON('admin_products'));
    setCategories(parseJSON('admin_categories'));
    setTables(parseJSON('admin_tables'));
  }, []);

  // Product handlers
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Please fill all product fields');
      return;
    }

    const newProduct = {
      id: editingId || Date.now(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
    };

    let updatedProducts;
    if (editingId) {
      updatedProducts = products.map((p) => (p.id === editingId ? newProduct : p));
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    setProductForm({ name: '', price: '', category: '' });
    setEditingId(null);
    setEditingType(null);
    alert(editingId ? 'Product updated' : 'Product added');
  };

  const handleEditProduct = (product) => {
    setProductForm({ name: product.name, price: product.price.toString(), category: product.category });
    setEditingId(product.id);
    setEditingType('product');
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
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
    localStorage.setItem('admin_tables', JSON.stringify(updatedTables));
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
      localStorage.setItem('admin_tables', JSON.stringify(updatedTables));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setProductForm({ name: '', price: '', category: '' });
    setCategoryForm({ name: '' });
    setTableForm({ number: '', seats: '', floor: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Restaurant POS</p>
              <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to Table Selection
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Manage products, categories, and tables. All changes are saved to local storage.
          </p>
        </div>

        <div className="rounded-3xl bg-white shadow-sm shadow-slate-200/80">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-6">
            {['products', 'categories', 'tables'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  cancelEdit();
                }}
                className={`rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {editingId && editingType === 'product' ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Category</label>
                      <input
                        type="text"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        placeholder="e.g., Meals, Beverages"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        {editingId ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  {products.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-center text-slate-500">No products yet.</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">₹{product.price.toFixed(2)} • {product.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {editingId && editingType === 'category' ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Category Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ name: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        {editingId ? 'Update Category' : 'Add Category'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  {categories.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-center text-slate-500">No categories yet.</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{category.name}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {editingId && editingType === 'table' ? 'Edit Table' : 'Add New Table'}
                  </h2>
                  <form onSubmit={handleAddTable} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Table Number</label>
                      <input
                        type="text"
                        value={tableForm.number}
                        onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
                        placeholder="e.g., Table 1"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Number of Seats</label>
                      <input
                        type="number"
                        value={tableForm.seats}
                        onChange={(e) => setTableForm({ ...tableForm, seats: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Floor</label>
                      <select
                        value={tableForm.floor}
                        onChange={(e) => setTableForm({ ...tableForm, floor: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-slate-900"
                      >
                        <option value="">Select Floor</option>
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="First Floor">First Floor</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        {editingId ? 'Update Table' : 'Add Table'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  {tables.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-center text-slate-500">No tables yet.</p>
                  ) : (
                    tables.map((table) => (
                      <div key={table.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{table.number}</p>
                          <p className="text-sm text-slate-600">{table.seats} seats • {table.floor}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditTable(table)}
                            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTable(table.id)}
                            className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
