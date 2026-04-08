import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [tx, setTx] = useState(null);
  useEffect(() => {
    api.get(`/transactions/${id}`).then((r) => setTx(r.data));
  }, [id]);
  if (!tx) return <p>Loading...</p>;

  return (
    <section>
      <h2>Transaction #{tx.id}</h2>
      <div className="panel">
        <p>Amount: ${Number(tx.amount).toFixed(2)} {tx.currency}</p>
        <p>Status: {tx.status}</p>
        <p>Date: {new Date(tx.created_at).toLocaleString()}</p>
        <p>PAN (unsafe): {tx.pan}</p>
        <p>CVV (unsafe): {tx.cvv}</p>
      </div>
    </section>
  );
}
