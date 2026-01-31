import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function LoansPage() {
  const { setAnalytics } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  
  // Toggle State: 'given' (To Take/Laina Hai) or 'taken' (To Give/Dena Hai)
  const [activeTab, setActiveTab] = useState("given");

  // Form States
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("https://zee-server.vercel.app/api/loans");
      setLoans(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleAddLoan = async (e) => {
    e.preventDefault();
    if (!name || !amount || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.post("https://zee-server.vercel.app/api/loans", {
        name,
        amount: Number(amount),
        reason,
        issueDate,
        type: activeTab, // Saves based on which tab is open
      });
      setLoans([res.data, ...loans]);
      setName(""); setAmount(""); setReason("");
      setIsModalOpen(false);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://zee-server.vercel.app/api/loans/${id}`);
      setLoans(loans.filter((loan) => loan._id !== id));
    } catch (err) { console.error(err); }
  };

  // Logic: Filter loans based on active tab
  const filteredLoans = loans.filter(loan => loan.type === activeTab || (!loan.type && activeTab === 'given'));
  const amountDue = filteredLoans.reduce((acc, loan) => acc + (Number(loan.amount) || 0), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      
      {/* Top Section with Title and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl underline font-bold ${activeTab === "given" ? "text-green-800" : "text-orange-800"}`}>
          {activeTab === "given" ? "Loans to Take" : "Loans to Give"}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all ${
            activeTab === "given" ? "bg-gradient-to-r from-green-500 to-teal-600" : "bg-gradient-to-r from-orange-500 to-red-600"
          }`}
        >
          <Plus size={18} /> Add Record
        </button>
      </div>

      {/* --- TOGGLE BUTTONS --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("given")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "given" ? "bg-white text-green-700 shadow" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            To Take
          </button>
          <button
            onClick={() => setActiveTab("taken")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === "taken" ? "bg-white text-orange-700 shadow" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            To Give
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead className={`text-center ${activeTab === "given" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center divide-gray-200">
            {filteredLoans.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-gray-400 font-medium">No records found for this category</td></tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{loan.name}</td>
                  <td className={`px-4 py-3 font-bold ${activeTab === "given" ? "text-green-700" : "text-orange-700"}`}>
                    PKR {loan.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 italic">{loan.reason || "---"}</td>
                  <td className="px-4 py-3 text-gray-500">{loan.issueDate?.split("T")[0]}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(loan._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-4">
        <div className={`flex-1 p-4 rounded-xl shadow-sm border ${activeTab === "given" ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
          <h3 className={`text-sm font-bold uppercase ${activeTab === "given" ? "text-green-700" : "text-orange-700"}`}>
            {activeTab === "given" ? "Total Receivable" : "Total Payable"}
          </h3>
          <p className={`text-2xl font-black ${activeTab === "given" ? "text-green-900" : "text-orange-900"}`}>
            PKR {amountDue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Modal - Same as yours but logic-enhanced */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-8 relative scale-up-center">
             <h3 className="text-xl font-bold mb-6">Add {activeTab === "given" ? "Loan to Take" : "Loan to Give"}</h3>
             <form onSubmit={handleAddLoan} className="space-y-4">
                <input required placeholder="Person/Supplier Name" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" value={name} onChange={e => setName(e.target.value)} />
                <input required type="number" placeholder="Amount (PKR)" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" value={amount} onChange={e => setAmount(e.target.value)} />
                <input placeholder="Reason (Optional)" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" value={reason} onChange={e => setReason(e.target.value)} />
                <input type="date" className="w-full border p-3 rounded-xl outline-none" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" disabled={isLoading} className={`flex-1 py-3 text-white rounded-xl font-bold ${activeTab === "given" ? "bg-green-600" : "bg-orange-600"}`}>
                    {isLoading ? "Saving..." : "Save Record"}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}