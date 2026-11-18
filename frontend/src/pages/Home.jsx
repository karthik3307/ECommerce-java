import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../api";

function Home({ user }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function loadProducts(text = "") {
    request("/products?search=" + encodeURIComponent(text))
      .then(setProducts)
      .catch((e) => setMessage(e.message));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addToCart(productId) {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await request("/cart", "POST", { userId: user.id, productId, quantity: 1 });
      setMessage("Added to cart");
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="search">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" onClick={() => loadProducts(search)}>Search</button>
      </div>
      {message && <p className="info">{message}</p>}

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="category">{p.category}</p>
            <p className="price">₹{p.price}</p>
            <p>{p.stock > 0 ? "In stock: " + p.stock : "Out of stock"}</p>
            <div className="row">
              <Link className="btn outline" to={"/product/" + p.id}>View</Link>
              <button className="btn" disabled={p.stock === 0} onClick={() => addToCart(p.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && <p>No products found.</p>}
    </div>
  );
}

export default Home;
