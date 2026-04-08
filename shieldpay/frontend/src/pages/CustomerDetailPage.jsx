import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    api.get(`/customers/${id}`).then((r) => setCustomer(r.data));
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  const save = async () => {
    await api.put(`/customers/${id}`, customer);
    navigate("/customers");
  };

  const remove = async () => {
    await api.delete(`/customers/${id}`);
    navigate("/customers");
  };

  return (
    <section>
      <h2>Customer #{id}</h2>
      <div className="inline-form">
        <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input value={customer.email || ""} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
        <input value={customer.phone || ""} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        <button className="btn" onClick={save} type="button">Save</button>
        <button className="btn danger" onClick={remove} type="button">Delete</button>
      </div>
    </section>
  );
}
