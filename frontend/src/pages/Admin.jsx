import { useEffect, useState } from "react";
import { request } from "../api";

const emptyForm = { name: "", description: "", price: "", stock: "", category: "", imageUrl: "" };

function Admin({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  function loadAll() {
    request("/products").then(setProducts);
    request("/orders").then(setOrders);
  }

  useEffect(() => {
    if (user && user.role === "ADMIN") loadAll();
  }, [user]);

  if (!user || user.role !== "ADMIN") return <p>Only admin can see this page.</p>;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editId) {
      await request("/products/" + editId, "PUT", body);
    } else {
      await request("/products", "POST", body);
    }
    setForm(emptyForm);
    setEditId(null);
    loadAll();
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      name: p.name, description: p.description || "", price: p.price,
      stock: p.stock, category: p.category || "", imageUrl: p.imageUrl || "",
    });
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await request("/products/" + id, "DELETE");
      loadAll();
    } catch (e) {
      alert("Cannot delete: " + e.message);
    }
  }

  async function changeStatus(id, status) {
    await request("/orders/" + id + "/status", "PUT", { status });
    loadAll();
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      <form className="form" onSubmit={handleSubmit}>
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button className="btn" type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button className="btn outline" type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Products</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>₹{p.price}</td><td>{p.stock}</td>
              <td>
                <button className="btn small" onClick={() => startEdit(p)}>Edit</button>{" "}
                <button className="btn small danger" onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Orders</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>User ID</th><th>Total</th><th>Status</th><th>Change status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.userId}</td><td>₹{o.total}</td><td>{o.status}</td>
              <td>
                <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                  <option>PLACED</option>
                  <option>SHIPPED</option>
                  <option>DELIVERED</option>
                  <option>CANCELLED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
