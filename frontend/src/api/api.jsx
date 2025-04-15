import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const register = async (data) => {
  try {
    const response = await API.post("/api/v1/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
};

const login = async (data) => {
  try {
    const response = await API.post("/api/v1/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

const logout = async () => {
  try {
    const response = await API.post("/logout");
    return response.data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
};

const me = async () => {
  try {
    const response = await API.get("/api/v1/auth/");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export { register, login, logout, me };
