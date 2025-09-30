import axios from "axios";

// ✅ Axios instance with base API URL
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://notes-manager-fs29.onrender.com/api",
});

// ✅ Helper to attach/remove JWT token
export function setToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}

export default API;
