// Base URL of the Spring Boot backend
export const API = "http://localhost:8080/api";

// Small helper around fetch: sends JSON and returns the JSON reply.
// If the server sends an error, it throws an Error with the server message.
export async function request(path, method = "GET", body) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API + path, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error((data && data.message) || "Something went wrong");
  }
  return data;
}

// The logged-in user is kept in localStorage
export function getUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}
