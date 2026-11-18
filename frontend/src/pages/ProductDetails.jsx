import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../api";

function ProductDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    request("/products/" + id)
      .then(setProduct)
      .catch((e) => setMessage(e.message));
  }, [id]);

  async function addToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await request("/cart", "POST", { userId: user.id, productId: product.id, quantity: Number(quantity) });
      setMessage("Added to cart");
    } catch (e) {
      setMessage(e.message);
    }
  }

  if (!product) return <p>{message || "Loading..."}</p>;

  return (
    <div className="details">
      <img src={product.imageUrl} alt={product.name} />
      <div>
        <h2>{product.name}</h2>
        <p className="category">{product.category}</p>
        <p>{product.description}</p>
        <p className="price">₹{product.price}</p>
        <p>{product.stock > 0 ? "In stock: " + product.stock : "Out of stock"}</p>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ width: 70 }}
        />{" "}
        <button className="btn" disabled={product.stock === 0} onClick={addToCart}>Add to Cart</button>
        {message && <p className="info">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetails;
