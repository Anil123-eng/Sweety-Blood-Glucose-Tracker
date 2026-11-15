
import { useState } from "react";
import api from "../services/api";

function useAuth(setMessage) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (showLogin) {
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setMessage("Login successful!");
        setPassword("");
        setIsLoggedIn(true);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      }

      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful! Please login.");

      setName("");
      setEmail("");
      setPassword("");
      setShowLogin(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    showLogin,
    setShowLogin,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}

export default useAuth;
