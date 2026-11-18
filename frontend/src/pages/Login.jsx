import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { request } from "../api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await request("/auth/login", "POST", { email, password });
      onLogin(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" type="submit">Login</button>
      <p>New user? <Link to="/register">Register here</Link></p>
    </form>
  );
}

export default Login;
