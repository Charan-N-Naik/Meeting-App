import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import server from "../environment";




// 1. Create Context
export const AuthContext = createContext(null);

// 2. Axios instance
const client = axios.create({
  baseURL: `${server}/api/v1/users`,
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
        navigate("/home");
      }
    } catch (error) {
      throw error;
    }
  };

   const getHistoryOfUser = async () => {
    try {
      const request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });

      return request.data;
    } catch (e) {
      throw e;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode
      });

      return request.data;
    } catch (e) {
      throw e;
    }
  };

  // Context value
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    addToUserHistory,
    getHistoryOfUser
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
