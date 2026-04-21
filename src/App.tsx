import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Printer, Eye, Layout } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePDF } from './components/InvoicePDF';
import type { InvoiceData } from './types';
import { format } from 'date-fns';

const initialData: InvoiceData = {
  invoiceNumber: 'INV-2024-001',
  date: format(new Date(), 'yyyy-MM-dd'),
  dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  senderName: 'Usman',
  senderEmail: 'usman@example.com',
  senderAddress: '123 Business St, City, State 12345',
  receiverName: 'Client Name',
  receiverEmail: 'client@example.com',
  receiverAddress: '456 Client Rd, City, State 67890',
  items: [
    { id: '1', description: 'Consulting Services', quantity: 10, price: 150 },
    { id: '2', description: 'Web Development', quantity: 1, price: 2500 },
  ],
  notes: 'Please pay within 30 days. Thank you!',
  taxRate: 10,
};

function App() {
  const [data, setData] = useState<InvoiceData>(initialData);

  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Layout size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Invoicely</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <Printer size={18} /> Print
              </button>
              <PDFDownloadLink
                document={<InvoicePDF data={data} />}
                fileName={`invoice-${data.invoiceNumber}.pdf`}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-semibold"
              >
                {({ loading }) => (
                  <>
                    <FileDown size={18} />
                    {loading ? 'Preparing...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
              <p className="text-sm text-gray-500">All changes are saved locally</p>
            </div>
            <InvoiceForm data={data} onChange={setData} />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye size={24} className="text-blue-600" /> Preview
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Actual Visual Preview */}
              <div className="p-8 md:p-12 aspect-[1/1.414] w-full max-w-full overflow-auto">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">INVOICE</h2>
                    <p className="text-gray-500 font-medium">#{data.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Date: {data.date}</p>
                    <p className="text-gray-500">Due: {data.dueDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">From</p>
                    <p className="font-bold text-gray-900 text-lg">{data.senderName || 'Your Name'}</p>
                    <p className="text-gray-500">{data.senderEmail || 'email@example.com'}</p>
                    <p className="text-gray-500 mt-2 whitespace-pre-wrap">{data.senderAddress || 'Your Address'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Bill To</p>
                    <p className="font-bold text-gray-900 text-lg">{data.receiverName || 'Client Name'}</p>
                    <p className="text-gray-500">{data.receiverEmail || 'client@example.com'}</p>
                    <p className="text-gray-500 mt-2 whitespace-pre-wrap">{data.receiverAddress || 'Client Address'}</p>
                  </div>
                </div>

                <div className="mb-12">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-gray-900 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Description</th>
                        <th className="py-3 px-2 text-right">Qty</th>
                        <th className="py-3 px-2 text-right">Price</th>
                        <th className="py-3 px-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.items.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="py-4 px-2 font-medium text-gray-900">{item.description || 'New Item'}</td>
                          <td className="py-4 px-2 text-right text-gray-500">{item.quantity}</td>
                          <td className="py-4 px-2 text-right text-gray-500">${item.price.toFixed(2)}</td>
                          <td className="py-4 px-2 text-right font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mb-12">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax ({data.taxRate}%)</span>
                      <span className="font-semibold text-gray-900">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t-2 border-gray-900">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-black text-xl text-gray-900">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {data.notes && (
                  <div className="pt-8 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{data.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
