'use client';
import { useEffect, useState } from 'react';
import { getInvoices } from '../../lib/api';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await getInvoices();
        setInvoices(res.data);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  function handlePrint() {
    window.print();
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-500 animate-pulse">Loading invoices...</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Invoices
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Invoice List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-blue-900 text-white p-4">
              <h2 className="font-semibold">All Invoices</h2>
            </div>
            {invoices.length === 0 ? (
              <p className="text-gray-400 text-center p-8">
                No invoices yet.
              </p>
            ) : (
              <div className="divide-y">
                {invoices.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                      selected?.id === inv.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <p className="font-semibold text-sm text-blue-800">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order #{inv.order?.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-bold text-green-600 mt-1">
                      ${inv.order?.totalAmount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
              Select an invoice to view details
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-6" id="invoice-print">

              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    Cafe Billing
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Official Invoice
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">
                    {selected.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selected.issuedAt).toLocaleDateString()}
                  </p>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {selected.isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Customer
                </p>
                <p className="font-semibold text-gray-800">
                  {selected.order?.customer?.name || 'Walk-in Customer'}
                </p>
                {selected.order?.customer?.phone && (
                  <p className="text-sm text-gray-500">
                    {selected.order.customer.phone}
                  </p>
                )}
                {selected.order?.customer?.email && (
                  <p className="text-sm text-gray-500">
                    {selected.order.customer.email}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <table className="w-full text-sm mb-6">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.order?.items?.map((item, i) => (
                    <tr key={i} className={`border-t ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                      <td className="p-3">{item.product?.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice}</td>
                      <td className="p-3 text-right font-semibold">
                        ${item.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${selected.order?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (5%)</span>
                    <span>${selected.order?.taxAmount}</span>
                  </div>
                  {selected.order?.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Discount</span>
                      <span>-${selected.order?.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg
                    text-gray-800 border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">
                      ${selected.order?.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment</span>
                    <span>{selected.order?.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selected.order?.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {selected.order.notes}
                  </p>
                </div>
              )}

              {/* Print Button */}
              <div className="flex justify-end">
                <button
                  onClick={handlePrint}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}