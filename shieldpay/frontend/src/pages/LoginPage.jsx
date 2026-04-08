import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function LoginPage({ auth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("merchant@demo.com");
  const [password, setPassword] = useState("Demo1234!");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("shieldpay_token", data.token);
      localStorage.setItem("shieldpay_user", JSON.stringify(data.user));
      auth.setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="centered">
      <form className="card-form" onSubmit={submit}>
        <h2>Login</h2>
        <p className="muted">Demo merchant is pre-seeded.</p>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Sign in</button>
        <p>New merchant? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
