import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ---------- LOGIN ----------
export const login = async (
  email: string,
  password: string
) => {
  const { data } = await API.post("/auth/login", {
    email,
    password,
  });

  return data;
};

// ---------- REGISTER ----------
export const register = async (
  fullName: string,
  email: string,
  password: string
) => {
  const { data } = await API.post("/auth/register", {
    fullName,
    email,
    password,
  });

  return data;
};

// ---------- PROFILE ----------
export const getProfile = async (token: string) => {
  const { data } = await API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ---------- LOGOUT ----------
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};