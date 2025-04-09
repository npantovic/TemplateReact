import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email: email,
        password_hash: password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div class="loader" href='/'>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
          </div>
          <div className="collapse navbar-collapse justify-content-end">
            <div className="navbar-nav">
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-outline-light me-2" onClick={handleRegisterClick}>
                Register
              </button>
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
