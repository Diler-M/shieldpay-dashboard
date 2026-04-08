import { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/admin/users"), api.get("/admin/merchants")]).then(([u, m]) => {
      setUsers(u.data);
      setMerchants(m.data);
    });
  }, []);

  return (
    <section>
      <h2>Admin</h2>
      <p className="muted">This page is visible in UI only for admin role, but API has intentional lab weakness.</p>
      <h3>Users</h3>
      <table><thead><tr><th>ID</th><th>Email</th><th>Role</th></tr></thead><tbody>
        {users.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.role}</td></tr>)}
      </tbody></table>
      <h3>Merchants</h3>
      <table><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody>
        {merchants.map((m) => <tr key={m.id}><td>{m.id}</td><td>{m.name}</td></tr>)}
      </tbody></table>
    </section>
  );
}
