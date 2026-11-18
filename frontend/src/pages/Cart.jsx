import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../api";

// Cart page with checkout (address + place order)
function Cart({ user }) {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function loadCart() {
    request("/cart/" + user.id)
      .then(setItems)
      .catch((e) => setMessage(e.message));
  }

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  if (!user) return <p>Please <Link to="/login">login</Link> to see your cart.</p>;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  async function removeItem(id) {
    await request("/cart/item/" + id, "DELETE");
    loadCart();
  }

  async function placeOrder() {
    try {
      await request("/orders", "POST", { userId: String(user.id), address });
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div>
      <h2>My Cart</h2>
      {message && <p className="error">{message}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
      ) : (
        <>
          <table>
            <thead>
              <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.product.name}</td>
                  <td>₹{i.product.price}</td>
                  <td>{i.quantity}</td>
                  <td>₹{i.product.price * i.quantity}</td>
                  <td><button className="btn small danger" onClick={() => removeItem(i.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ₹{total}</h3>

          <div className="form">
            <h3>Checkout</h3>
            <textarea
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="btn" onClick={placeOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
