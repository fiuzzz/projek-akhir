// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgot-password/ForgotPaassword";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
