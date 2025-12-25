import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function Sales() {
    const { analytics, setAnalytics } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState([]);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalSale, setTotalSale] = useState("");
  const [totalExpense, setTotalExpense] = useState("");


   const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!date || !totalSale || !totalExpense) return;

    const sale = Number(totalSale);
    const expense = Number(totalExpense);
    const profit = sale - expense;

    try {
      const res = await axios.post("https://zee-server.vercel.app/api/sales", {
        date,
        totalSale: sale,
        totalExpense: expense,
        profit,
      });

      setRecords(prev => [...prev, res.data]);

      // ✅ MATCHING THE NAVBAR KEYS
      setAnalytics(prev => ({
        totalSales: (prev.totalSales || 0) + sale,
        totalExpenses: (prev.totalExpenses || 0) + expense,
        profit: (prev.profit || 0) + profit
      }));

      setTotalSale("");
      setTotalExpense("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const handleDelete = async (rec) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`https://zee-server.vercel.app/api/sales/${rec._id}`);

      setRecords(prev => prev.filter(r => r._id !== rec._id));

      // ✅ CORRECTED: Using Singular names from the 'rec' object 
      // but updating Plural names in the Analytics state
      setAnalytics(prev => ({
        totalSales: prev.totalSales - (rec.totalSale || 0),
        totalExpenses: prev.totalExpenses - (rec.totalExpense || 0),
        profit: prev.profit - (rec.profit || 0)
      }));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(
          "https://zee-server.vercel.app/api/sales"
        );
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    fetchSales();
  }, []);
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-[#3777FF] underline font-bold">
          Daily Sales Record
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r text-center from-blue-100 to-blue-200 text-blue-800">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total Sale</th>
              <th className="px-4 py-2">Total Expense</th>
              <th className="px-4 py-2">Profit</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center divide-gray-200">
            {!Array.isArray(records) || records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-gray-500">
                  No records added yet
                </td>
              </tr>
            ) : (
              records.map((rec, i) => (
                <tr key={rec._id || i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {rec.date ? new Date(rec.date).toISOString().split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-2">{rec.totalSale}</td>
                  <td className="px-4 py-2">{rec.totalExpense}</td>
                  <td className="px-4 py-2 text-green-600 font-bold">
                    {rec.profit}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(rec)}
                      className="bg-red-500 rounded-full px-4 py-2 hover:bg-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Record */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-slate-900">
              Add Daily Record
            </h3>

            <form className="space-y-4" onSubmit={handleAddRecord}>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Sale</label>
                <input
                  type="number"
                  value={totalSale}
                  onChange={(e) => setTotalSale(e.target.value)}
                  placeholder="PKR"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Expense</label>
                <input
                  type="number"
                  value={totalExpense}
                  onChange={(e) => setTotalExpense(e.target.value)}
                  placeholder="PKR"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
