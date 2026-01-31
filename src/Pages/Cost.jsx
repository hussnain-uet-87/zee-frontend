import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:5000/api" 
  : "https://zee-server.vercel.app/api";

export default function ItemsCostPage() {
  const { setAnalytics, fetchAnalytics } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  // Form States
  const [inventoryName, setInventoryName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/items-cost`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Error fetching items:", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!inventoryName || !price || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/items-cost`, {
        inventoryName,
        price: Number(price),
        date
      });

      setItems([res.data, ...items]);
      
      // LOGIC: Subtract from Item Cost Price and Total Sales (Amount in Hand)
      setAnalytics(prev => ({
        ...prev,
        totalExpenses: (prev.totalExpenses || 0) - Number(price), // Subtract from Cost box
        totalSales: (prev.totalSales || 0) - Number(price)        // Subtract from Sales box (Hand Cash)
      }));

      setInventoryName(""); 
      setPrice(""); 
      setIsModalOpen(false);
    } catch (err) { 
      alert("Failed to save item."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_BASE}/items-cost/${item._id}`);
      
      // LOGIC: Reverse the action - Add back to Cost and Amount in Hand
      setAnalytics(prev => ({
        ...prev,
        totalExpenses: (prev.totalExpenses || 0) + Number(item.price),
        totalSales: (prev.totalSales || 0) + Number(item.price)
      }));

      setItems(items.filter((i) => i._id !== item._id));
    } catch (err) { console.error(err); }
  };

  const totalSpentOnInventory = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-red-800 underline font-bold">Items Cost Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
          <Plus size={18} /> Add New Stock
        </button>
      </div>

      <div className="mb-6 bg-red-100 p-4 rounded-lg shadow border border-red-200 w-fit min-w-[250px]">
          <h3 className="text-sm font-medium text-red-800 uppercase tracking-wider">Is Month Purchase kea hua Saman</h3>
          <p className="text-2xl font-bold text-red-900">PKR {totalSpentOnInventory.toLocaleString()}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r text-center from-red-100 to-rose-200 text-red-800">
            <tr>
              <th className="px-4 py-2">Inventory Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center divide-gray-200">
            {items.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-gray-500">No stock records found</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium">{item.inventoryName}</td>
                  <td className="px-4 py-2 text-red-600 font-bold">PKR {item.price}</td>
                  <td className="px-4 py-2">{new Date(item.date).toISOString().split("T")[0]}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(item)} className="bg-red-500 rounded-full hover:bg-red-600 px-6 py-3 transition cursor-pointer">
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
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><X size={18} /></button>
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Add Inventory Stock</h3>
            <form className="space-y-4" onSubmit={handleAddItem}>
              <div>
                <label className="block text-sm font-medium mb-1">Inventory Name</label>
                <input required type="text" placeholder="e.g. 50 iPhone Chargers" value={inventoryName} onChange={(e) => setInventoryName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (PKR)</label>
                <input required type="number" placeholder="Enter total cost" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isLoading} className={`px-4 py-2 text-white rounded-lg ${isLoading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"}`}>
                  {isLoading ? "Saving..." : "Save Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}