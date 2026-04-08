import { useEffect, useState } from "react";
import api from "../api.js";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;
  const max = Math.max(...stats.daily.map((d) => d.count), 1);

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="panel"><h3>Total Tx</h3><p>{stats.totals.txCount}</p></div>
        <div className="panel"><h3>Volume</h3><p>${Number(stats.totals.volume).toFixed(2)}</p></div>
        <div className="panel"><h3>Customers</h3><p>{stats.customers}</p></div>
        <div className="panel"><h3>Cards</h3><p>{stats.cards}</p></div>
      </div>
      <h3>7 Day Activity</h3>
      <div className="bars">
        {stats.daily.map((d) => (
          <div key={d.day} className="bar-wrap">
            <div className="bar" style={{ height: `${(d.count / max) * 120}px` }} />
            <small>{d.day.slice(5)}</small>
          </div>
        ))}
      </div>
      <h3>Recent Transactions</h3>
      <table>
        <thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {stats.recent.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>${Number(t.amount).toFixed(2)}</td>
              <td>{t.status}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
