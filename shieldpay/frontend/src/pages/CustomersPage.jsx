import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const load = () => api.get(`/customers?q=${encodeURIComponent(q)}`).then((r) => setRows(r.data));
  useEffect(() => { load(); }, []); // eslint-disable-line

  const add = async (e) => {
    e.preventDefault();
    await api.post("/customers", form);
    setForm({ name: "", email: "", phone: "" });
    load();
  };

  return (
    <section>
      <h2>Customers</h2>
      <div className="row">
        <input placeholder="Search name..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={load} type="button">Search</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th /></tr></thead>
        <tbody>{rows.map((c) => <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td><Link to={`/customers/${c.id}`}>View</Link></td></tr>)}</tbody>
      </table>
      <h3>Add Customer</h3>
      <form className="inline-form" onSubmit={add}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn" type="submit">Add</button>
      </form>
    </section>
  );
}
