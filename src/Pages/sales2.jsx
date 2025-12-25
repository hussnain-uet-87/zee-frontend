import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function Sales() {
  // ✅ USE ANALYTICS STATE, NOT fetchAnalytics
  const { analytics, setAnalytics } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState([]);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalSale, setTotalSale] = useState("");
  const [totalExpense, setTotalExpense] = useState("");

  // ---------------- ADD RECORD ----------------
  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!date || !totalSale || !totalExpense) return;

    const sale = Number(totalSale);
    const expense = Number(totalExpense);
    const profit = sale - expense;

    try {
      const res = await axios.post(
        "https://zee-server.vercel.app/api/sales",
        { date, totalSale: sale, totalExpense: expense, profit }
      );

      // ✅ Update UI instantly
      setRecords(prev => [...prev, res.data]);

      // ✅ Update analytics locally (NO DB HIT)
      setAnalytics(prev => ({
        totalSales: prev.totalSales + sale,
        totalExpenses: prev.totalExpenses + expense,
        profit: prev.profit + profit
      }));

      setTotalSale("");
      setTotalExpense("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  // ---------------- DELETE RECORD ----------------
  const handleDelete = async (rec) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(
        `https://zee-server.vercel.app/api/sales/${rec._id}`
      );

      // ✅ Update UI
      setRecords(prev => prev.filter(r => r._id !== rec._id));

      // ✅ Update analytics locally
      setAnalytics(prev => ({
        totalSales: prev.totalSales - rec.totalSale,
        totalExpenses: prev.totalExpenses - rec.totalExpense,
        profit: prev.profit - rec.profit
      }));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // ---------------- FETCH SALES ONCE ----------------
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
    <div className="p-6 min-h-screen bg-slate-100">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-600">
          Daily Sales Record
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} /> Add Record
        </button>
      </div>

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th>Date</th>
            <th>Sale</th>
            <th>Expense</th>
            <th>Profit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {records.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-gray-500">
                No records
              </td>
            </tr>
          ) : (
            records.map(rec => (
              <tr key={rec._id}>
                <td>{rec.date?.split("T")[0]}</td>
                <td>{rec.totalSale}</td>
                <td>{rec.totalExpense}</td>
                <td className="text-green-600 font-bold">
                  {rec.profit}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(rec)}
                    className="bg-red-500 px-3 py-1 rounded-full"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal unchanged – omitted for brevity */}
    </div>
  );
}
