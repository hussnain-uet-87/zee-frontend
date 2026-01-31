import { useState, useEffect } from "react";
import { Plus, X, Trash2, FileText } from "lucide-react";
import axios from "axios";

const API_BASE = "https://zee-server.vercel.app/api/reports"; // Update to your live URL if needed

export default function MonthlyReportsPage() {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    monthName: "",
    totalSale: "",
    itemsCostPrice: "",
    itemsPurchasedPrice: "",
    shopExpense: "",
    totalProfit: "",
    availableProfit: ""
  });

  const fetchReports = async () => {
    try {
      const res = await axios.get(API_BASE);
      setReports(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(API_BASE, formData);
      setReports([res.data, ...reports]);
      setIsModalOpen(false);
      setFormData({ monthName: "", totalSale: "", itemsCostPrice: "", itemsPurchasedPrice: "", shopExpense: "", totalProfit: "", availableProfit: "" });
    } catch (err) { alert("Error saving report"); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this monthly record?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-indigo-800 underline font-bold">Monthly History Reports</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
          <Plus size={18} /> Save Month Record
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r text-center from-indigo-100 to-purple-200 text-indigo-800">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Total Sale</th>
              <th className="px-4 py-3">Stock Cost</th>
              <th className="px-4 py-3">Shop Exp.</th>
              <th className="px-4 py-3">Total Profit</th>
              <th className="px-4 py-3">Avail. Profit</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-indigo-900">{report.monthName}</td>
                <td className="px-4 py-3 text-blue-700 font-semibold">{report.totalSale.toLocaleString()}</td>
                <td className="px-4 py-3 text-red-600">{report.itemsCostPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-amber-700">{report.shopExpense.toLocaleString()}</td>
                <td className="px-4 py-3 text-teal-700 font-bold">{report.totalProfit.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700 font-bold">{report.availableProfit.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(report._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8 relative">
            <h3 className="text-xl font-bold mb-4 text-indigo-900">Close Monthly Account</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500">MONTH NAME</label>
                <input required placeholder="e.g. October 2025" className="w-full border p-2 rounded-lg" value={formData.monthName} onChange={e => setFormData({...formData, monthName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Total Sale</label>
                <input required type="number" className="w-full border p-2 rounded-lg" value={formData.totalSale} onChange={e => setFormData({...formData, totalSale: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Item Cost Price</label>
                <input required type="number" className="w-full border p-2 rounded-lg" value={formData.itemsCostPrice} onChange={e => setFormData({...formData, itemsCostPrice: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">New Stock Price</label>
                <input required type="number" className="w-full border p-2 rounded-lg" value={formData.itemsPurchasedPrice} onChange={e => setFormData({...formData, itemsPurchasedPrice: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Shop Expense</label>
                <input required type="number" className="w-full border p-2 rounded-lg" value={formData.shopExpense} onChange={e => setFormData({...formData, shopExpense: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Total Profit</label>
                <input required type="number" className="w-full border p-2 rounded-lg" value={formData.totalProfit} onChange={e => setFormData({...formData, totalProfit: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Available Profit</label>
                <input required type="number" className="w-full border p-2 rounded-lg border-green-400 bg-green-50" value={formData.availableProfit} onChange={e => setFormData({...formData, availableProfit: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}