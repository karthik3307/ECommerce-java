import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api";

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) request("/orders/user/" + user.id).then(setOrders).catch(() => {});
  }, [user]);

  if (!user) return <p>Please <Link to="/login">login</Link> to see your orders.</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>You have not placed any orders yet.</p>}
      {orders.map((o) => (
        <div className="card order" key={o.id}>
          <p><b>Order #{o.id}</b> — {o.status}</p>
          <p>Date: {new Date(o.orderDate).toLocaleString()}</p>
          <p>Address: {o.address}</p>
          <ul>
            {o.items.map((i) => (
              <li key={i.id}>{i.productName} × {i.quantity} — ₹{i.price * i.quantity}</li>
            ))}
          </ul>
          <p><b>Total: ₹{o.total}</b></p>
        </div>
      ))}
    </div>
  );
}

export default Orders;
