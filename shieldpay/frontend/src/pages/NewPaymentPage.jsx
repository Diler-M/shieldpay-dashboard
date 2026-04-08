import { useEffect, useState } from "react";
import api from "../api.js";

export default function NewPaymentPage() {
  const [customers, setCustomers] = useState([]);
  const [cards, setCards] = useState([]);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ customer_id: "", card_id: "", amount: "25.00", currency: "USD" });

  useEffect(() => {
    Promise.all([api.get("/customers"), api.get("/cards")]).then(([c, k]) => {
      setCustomers(c.data);
      setCards(k.data);
    });
  }, []);

  const pay = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/payments/process", form);
    setResult(data);
  };

  return (
    <section>
      <h2>New Payment</h2>
      <form className="inline-form" onSubmit={pay}>
        <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
          <option value="">Customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.card_id} onChange={(e) => setForm({ ...form, card_id: e.target.value })}>
          <option value="">Card</option>
          {cards.map((c) => <option key={c.id} value={c.id}>{c.pan}</option>)}
        </select>
        <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        <button className="btn" type="submit">Process</button>
      </form>
      {result && <p>Payment {result.id} status: <strong>{result.status}</strong></p>}
    </section>
  );
}
