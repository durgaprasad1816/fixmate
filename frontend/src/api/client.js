import axios from "axios";

// The backend runs on :8080 by default (see backend/src/main/resources/application.properties).
// Change this if you deploy the backend somewhere else, or set VITE_API_BASE_URL in a .env file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if we have one) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixmate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, boot the user back to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("fixmate_token");
      localStorage.removeItem("fixmate_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
