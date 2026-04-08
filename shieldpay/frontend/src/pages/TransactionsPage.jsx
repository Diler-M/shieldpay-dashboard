import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/transactions").then((r) => setRows(r.data));
  }, []);

  return (
    <section>
      <h2>Transactions</h2>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th /></tr></thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.customer_name}</td>
              <td>${Number(t.amount).toFixed(2)}</td>
              <td>{t.status}</td>
              <td><Link to={`/transactions/${t.id}`}>Detail</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
