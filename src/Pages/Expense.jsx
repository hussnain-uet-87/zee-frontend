import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://zee-server.vercel.app/api";

export default function Expense() {
    // Get the tools from DashboardLayout context
    const { setAnalytics, fetchAnalytics } = useOutletContext(); 

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [records, setRecords] = useState([]);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // 1. Fetch Expenses and Sync Navbar on Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get(`${API_BASE}/expenses`);
                setRecords(Array.isArray(res.data) ? res.data : []);
                
                // This ensures the Navbar gets fresh data from the DB on refresh
                if (fetchAnalytics) await fetchAnalytics();
            } catch (err) { 
                console.error("Error loading expenses:", err); 
            }
        };
        loadData();
    }, [fetchAnalytics]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!name || !amount || isLoading) return;

        setIsLoading(true);
        const expenseAmount = Number(amount);

        try {
            const res = await axios.post(`${API_BASE}/expenses`, {
                name, 
                amount: expenseAmount, 
                extraInfo, 
                date
            });

            // 2. Update Local State for instant UI feedback
            setAnalytics(prev => ({
                ...prev,
                shopExpenses: (Number(prev.shopExpenses) || 0) + expenseAmount, 
                profit: (Number(prev.profit) || 0) - expenseAmount
            }));

            // 3. CRITICAL: Pull updated totals from Database to prevent reset on refresh
            if (fetchAnalytics) await fetchAnalytics();

            setRecords(prev => [...prev, res.data]);
            setIsModalOpen(false);
            setName(""); setAmount(""); setExtraInfo("");
        } catch (err) { 
            console.error(err);
            alert("Failed to save expense."); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleDelete = async (rec) => {
        if (!window.confirm("Delete this expense?")) return;
        try {
            await axios.delete(`${API_BASE}/expenses/${rec._id}`);

            // Update Local State
            setAnalytics(prev => ({
                ...prev,
                shopExpenses: Math.max(0, (Number(prev.shopExpenses) || 0) - Number(rec.amount)),
                profit: (Number(prev.profit) || 0) + Number(rec.amount)
            }));

            // Sync with DB
            if (fetchAnalytics) await fetchAnalytics();

            setRecords(prev => prev.filter(r => r._id !== rec._id));
        } catch (err) { 
            console.error(err); 
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl text-amber-800 underline font-bold">Shop Expense Record</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-800 px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gradient-to-r text-center from-amber-100 to-amber-200 text-amber-800">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Extra Info</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-center divide-gray-200">
                        {records.length === 0 ? (
                            <tr><td colSpan={5} className="py-4 text-gray-500">No expenses recorded</td></tr>
                        ) : (
                            records.map((rec) => (
                                <tr key={rec._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-medium">{rec.name}</td>
                                    <td className="px-4 py-2 text-red-600 font-bold">PKR {rec.amount}</td>
                                    <td className="px-4 py-2 text-gray-500 text-sm">{rec.extraInfo || "-"}</td>
                                    <td className="px-4 py-2">{new Date(rec.date).toISOString().split("T")[0]}</td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => handleDelete(rec)} className="bg-red-500 rounded-full px-3 py-1.5 hover:bg-red-600 transition">
                                            <Trash2 size={16} className="text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500"><X size={18}/></button>
                        <h3 className="text-lg font-semibold mb-4">Add Expense Record</h3>
                        <form className="space-y-4" onSubmit={handleAddExpense}>
                            <input required type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Expense Name (e.g. Rent)" />
                            <input required type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Amount (PKR)" />
                            <input type="text" value={extraInfo} onChange={(e)=>setExtraInfo(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Extra Info (Optional)" />
                            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-red-300">
                                    {isLoading ? "Saving..." : "Save Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}