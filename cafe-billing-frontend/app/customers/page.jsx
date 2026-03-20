'use client';
import { useEffect, useState } from 'react';
import {
  getCustomers, createCustomer, updateCustomer,
  deleteCustomer, searchCustomers
} from '../../lib/api';

const EMPTY_FORM = { name: '', phone: '', email: '' };

export default function CustomersPage() {
  const [customers, setCustomers]   = useState([]);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editingId, setEditingId]   = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]       = useState(false);
  const [message, setMessage]       = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  }

  async function handleSearch(e) {
    const val = e.target.value;
    setSearchTerm(val);
    try {
      if (val.trim() === '') {
        fetchCustomers();
      } else {
        const res = await searchCustomers(val);
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  function handleEdit(customer) {
    setForm({
      name:  customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
    });
    setEditingId(customer.id);
    setShowForm(true);
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit() {
    if (!form.name) {
      setMessage('Name is required.');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        setMessage('Customer updated!');
      } else {
        await createCustomer(form);
        setMessage('Customer added!');
      }
      handleCancel();
      fetchCustomers();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete customer "${name}"?`)) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
      setMessage('Customer deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error deleting customer.');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          {showForm ? 'Cancel' : '+ Add Customer'}
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
            {editingId ? 'Edit Customer' : 'New Customer'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Name *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 555-1234"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. john@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Save Customer'}
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

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full sm:w-80 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Loyalty Points</th>
              <th className="p-4 text-left">Total Spent</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 p-10">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.id}
                  className={`border-t hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                  <td className="p-4 text-gray-500">#{c.id}</td>
                  <td className="p-4 font-semibold">{c.name}</td>
                  <td className="p-4">{c.phone || '-'}</td>
                  <td className="p-4">{c.email || '-'}</td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                      {c.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-semibold">
                    ${c.totalSpent}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
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