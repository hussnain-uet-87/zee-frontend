import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Sales from "./Pages/Sales";
import Loans from "./Pages/Loans";
import Reports from "./Pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import Expense from "./Pages/Expense";
import Cost from "./Pages/Cost";
import MonthlyReportsPage from "./Pages/MonthlyReportsPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
         <Route index element={<Navigate to="sales" replace />} />
        <Route path="sales" element={<Sales />} />
        <Route path="loans" element={<Loans />} />
        <Route path="reports" element={<Reports />} />
        <Route path="expenses" element={<Expense />} />
        <Route path="items-cost" element={<Cost />} />
        <Route path="monthly-reports" element={<MonthlyReportsPage />} />

      </Route>
    </Routes>
  );
}

export default App;
