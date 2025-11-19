// src/utils/url.js (or directly inside EditCard.jsx)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5018";

export const getFullImageUrl = (url) => {
  if (!url) return "";
  
  // If the URL is already full (starts with http:// or https://) → return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If it's a relative path → concatenate with backend URL
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_URL.replace(/\/$/, "")}${cleanPath}`;
};
