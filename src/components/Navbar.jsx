export default function Navbar({ analytics }) {
  // Destructure for cleaner code, providing defaults
  const { totalSales = 0, totalExpenses = 0, profit = 0 } = analytics || {};

  return (
    <header className="h-40 bg-white border-b flex flex-col justify-between px-6 pb-10 shadow-sm">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Zee Mobile Shop
        </h2>
        {/* Logout button remains the same */}
      </div>  

      <div className="flex gap-4 py-2">
        <div className="flex-1 bg-blue-100 p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-blue-800">Total Sale</h4>
          <p className="text-xl font-bold text-blue-900">{totalSales.toLocaleString()} PKR</p>
        </div>

        <div className="flex-1 bg-red-100 p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-red-800">Total Expense</h4>
          <p className="text-xl font-bold text-red-900">{totalExpenses.toLocaleString()} PKR</p>
        </div>

        <div className="flex-1 bg-green-100 p-3 rounded-lg shadow">
          <h4 className="text-sm font-medium text-green-800">Total Profit</h4>
          <p className="text-xl font-bold text-green-900">{profit.toLocaleString()} PKR</p>
        </div>
      </div>
    </header>
  );
}