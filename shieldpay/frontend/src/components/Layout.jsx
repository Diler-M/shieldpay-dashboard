import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout({ user }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("shieldpay_token");
    localStorage.removeItem("shieldpay_user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>ShieldPay</h1>
        <p className="muted">{user?.email}</p>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/cards">Cards</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/payments/new">New Payment</Link>
          <Link to="/settings">Settings</Link>
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>
        <button className="btn danger" onClick={logout} type="button">
          Logout
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
