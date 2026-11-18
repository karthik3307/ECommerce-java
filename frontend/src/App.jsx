import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "./api";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(getUser());

  function login(u) {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/product/:id" element={<ProductDetails user={user} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
