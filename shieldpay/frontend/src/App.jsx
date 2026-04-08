import { Navigate, Route, Routes } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import CardsPage from "./pages/CardsPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransactionDetailPage from "./pages/TransactionDetailPage.jsx";
import NewPaymentPage from "./pages/NewPaymentPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("shieldpay_user") || "null");
  } catch {
    return null;
  }
}

function Protected({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout user={user} />;
}

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage auth={value} />} />
      <Route path="/register" element={<RegisterPage auth={value} />} />
      <Route path="/" element={<Protected user={user} />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/:id" element={<TransactionDetailPage />} />
        <Route path="payments/new" element={<NewPaymentPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
