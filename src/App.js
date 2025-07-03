import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginComp/Login";
import Users from "./components/Users";
import Profile from "./components/ProfileComp/Profile";
import Home from "./components/HomeComp/Home";
import Register from "./components/RegisterComp/Register";
import ResetPassword from "./components/ResetPassword/ResetPassword";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;