import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import axios from "axios";

export default function LoansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loans, setLoans] = useState([]);
  const [reason, setReason] = useState("");
  // Modal fields
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch loans
  const fetchLoans = async () => {
    try {
      const res = await axios.get("https://zee-server.vercel.app/api/loans");
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Add new loan
  const handleAddLoan = async (e) => {
    e.preventDefault();
    if (!name || !amount || !issueDate) return;

    try {
      const res = await axios.post("https://zee-server.vercel.app/api/loans", {
        name,
        amount,
        reason,
        issueDate,
      });
      setLoans([res.data, ...loans]); // Add to top
      setName("");
      setAmount("");
      setReason("");
      setIssueDate(new Date().toISOString().split("T")[0]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete loan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;

    try {
      await axios.delete(`https://zee-server.vercel.app/api/loans/${id}`);
      setLoans(loans.filter((loan) => loan._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  
  // Totals
  const totalLoansDue = loans.length;
  const amountDue = loans.reduce((acc, loan) => acc + loan.amount, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-green-800 underline font-bold">Loan Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Add Loan
        </button>
      </div>

      {/* Loans Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r text-center from-green-100 to-teal-200 text-green-800">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Issue Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center divide-gray-200">
            {loans.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-gray-500">
                  No loans found
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{loan.name}</td>
                  <td className="px-4 py-2 text-green-700 font-semibold">{loan.amount}</td>
                        <td className="px-4 py-2">{loan.reason}</td>

                  <td className="px-4 py-2">{loan.issueDate.split("T")[0]}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(loan._id)}
                      className="bg-red-500 rounded-full hover:bg-red-600 px-6 py-3 transition cursor-pointer"
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

      {/* Total Loans Due & Amount Due */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex-1 bg-green-100 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-green-800">Total Loans Due</h3>
          <p className="text-2xl font-bold text-green-900">{totalLoansDue}</p>
        </div>
        <div className="flex-1 bg-teal-100 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-teal-800">Amount Due in Loans</h3>
          <p className="text-2xl font-bold text-teal-900">PKR {amountDue}</p>
        </div>
      </div>

      {/* Modal for Adding Loan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-slate-900">Add New Loan</h3>

            <form className="space-y-4" onSubmit={handleAddLoan}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="PKR"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
              <div>
  <label className="block text-sm font-medium mb-1">Reason</label>
  <input
    type="text"
    placeholder="Short reason"
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
  />
</div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
