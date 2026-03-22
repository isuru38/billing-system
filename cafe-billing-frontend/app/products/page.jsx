'use client';
import { useEffect, useState } from 'react';
import {
  getProducts, createProduct, updateProduct, deleteProduct
}  from '../../lib/api';

const EMPTY_FORM = {
  name: '', description: '', price: '', stockQuantity: '', isAvailable: true
};

export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [message, setMessage]     = useState('');

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  function handleEdit(product) {
    setForm({
      name:          product.name,
      description:   product.description || '',
      price:         product.price,
      stockQuantity: product.stockQuantity,
      isAvailable:   product.isAvailable,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit() {
    if (!form.name || !form.price) {
      setMessage('Name and Price are required.');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setMessage('Product updated!');
      } else {
        await createProduct(form);
        setMessage('Product added!');
      }
      handleCancel();
      fetchProducts();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      fetchProducts();
      setMessage('Product deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error deleting product.');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Product' : 'New Product'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Product Name *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Cappuccino"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Price ($) *
              </label>
              <input
                type="number" step="0.01"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 4.50"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 100"
                value={form.stockQuantity}
                onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Classic Italian espresso"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="available"
                checked={form.isAvailable}
                onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="available" className="text-sm text-gray-600">
                Available for ordering
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 p-10">
                  No products yet. Click "Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr key={p.id}
                  className={`border-t hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                  <td className="p-4 text-gray-500">#{p.id}</td>
                  <td className="p-4 font-semibold text-gray-800">{p.name}</td>
                  <td className="p-4 text-gray-500">{p.description || '-'}</td>
                  <td className="p-4 font-semibold text-green-600">${p.price}</td>
                  <td className="p-4">{p.stockQuantity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {p.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}