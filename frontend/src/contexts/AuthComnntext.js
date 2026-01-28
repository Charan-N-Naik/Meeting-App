import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 1. Create Context
export const AuthContext = createContext(null);

// 2. Axios instance
const client = axios.create({
  baseURL: "http://localhost:5000/api/v1/users",
});

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Register
  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });

      if (response.status === 201) {
        return response.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  // Login
  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
