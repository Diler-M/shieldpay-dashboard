import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function RegisterPage({ auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/register", { email, password, merchantName });
    localStorage.setItem("shieldpay_token", data.token);
    localStorage.setItem("shieldpay_user", JSON.stringify(data.user));
    auth.setUser(data.user);
    navigate("/");
  };

  return (
    <div className="centered">
      <form className="card-form" onSubmit={submit}>
        <h2>Register Merchant</h2>
        <label>Merchant Name</label>
        <input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" type="submit">Create account</button>
        <p>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
