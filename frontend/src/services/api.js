import axios from "axios";

const API = axios.create({
  baseURL: "https://education-adivsor.onrender.com/api",
});

// This runs before every single request made through API.
// It checks localStorage for a saved token and, if one exists, attaches
// it to the Authorization header automatically. Without this, your
// protected routes (anything using your `protect` middleware) will
// always reject the request, even right after a successful login -
// because the backend never receives the token to verify.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
