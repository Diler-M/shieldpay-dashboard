import { useEffect, useState } from "react";
import api from "../api.js";

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    cardholder_name: "",
    pan: "4000000000000002",
    expiry_month: "12",
    expiry_year: "2031",
    cvv: "999"
  });

  const load = async () => {
    const [a, b] = await Promise.all([api.get("/cards"), api.get("/customers")]);
    setCards(a.data);
    setCustomers(b.data);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const add = async (e) => {
    e.preventDefault();
    await api.post("/cards", form);
    load();
  };

  return (
    <section>
      <h2>Cards</h2>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>PAN (unsafe)</th><th>CVV (unsafe)</th></tr></thead>
        <tbody>
          {cards.map((c) => <tr key={c.id}><td>{c.id}</td><td>{c.customer_id}</td><td>{c.pan}</td><td>{c.cvv}</td></tr>)}
        </tbody>
      </table>
      <h3>Add Card (Test Data)</h3>
      <form className="inline-form" onSubmit={add}>
        <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
          <option value="">Choose customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Cardholder" value={form.cardholder_name} onChange={(e) => setForm({ ...form, cardholder_name: e.target.value })} />
        <input placeholder="PAN" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
        <input placeholder="MM" value={form.expiry_month} onChange={(e) => setForm({ ...form, expiry_month: e.target.value })} />
        <input placeholder="YYYY" value={form.expiry_year} onChange={(e) => setForm({ ...form, expiry_year: e.target.value })} />
        <input placeholder="CVV" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} />
        <button className="btn" type="submit">Add card</button>
      </form>
    </section>
  );
}
