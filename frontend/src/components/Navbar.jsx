import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">ShopEasy</Link>
      <div className="links">
        <Link to="/">Home</Link>
        {user && <Link to="/cart">Cart</Link>}
        {user && <Link to="/orders">My Orders</Link>}
        {user && user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="hello">Hi, {user.name}</span>
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
