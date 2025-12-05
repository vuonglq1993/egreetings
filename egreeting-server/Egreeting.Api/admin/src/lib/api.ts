// src/lib/api.ts   ← recommended path for shared utilities

const API_BASE = "http://localhost:5288/";

function getToken() {
  return localStorage.getItem("token");
}

// Generic fetch wrapper
async function fetchWithAuth(
  input: string,
  init?: RequestInit
): Promise<any> {
  const token = getToken();
  const headers: HeadersInit = {
    ...init?.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  const res = await fetch(API_BASE + input, { ...init, headers });

  if (!res.ok) {
    let errMsg = "Unknown error";
    try {
      errMsg = await res.text();
    } catch {}
    throw new Error(`HTTP ${res.status}: ${errMsg}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// GET
export async function apiGet<T = any>(url: string): Promise<T> {
  return fetchWithAuth(url);
}

// POST
export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  return fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT
export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  return fetchWithAuth(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE
export async function apiDelete<T = any>(url: string): Promise<T> {
  return fetchWithAuth(url, { method: "DELETE" });
}

// AUTH
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json();
}

export function saveAuth(token: string, role: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function isAdmin(): boolean {
  const role = localStorage.getItem("role");
  return role?.toLowerCase() === "admin";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login.html"; // or your login route
}

// Optional: Count helper (if your backend supports /count endpoint)
export async function getCount(entity: string): Promise<{ total: number }> {
  return apiGet(`/api/${entity}/count`);
}