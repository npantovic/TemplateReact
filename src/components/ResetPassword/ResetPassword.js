import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const formRef = useRef(null); // Kreiranje referencije za formu
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = formRef.current.email.value; // Dohvatanje email-a iz forme
      const response = await axios.post("http://localhost:8000/api/v1/auth/password_reset_request_no_login", {
        email,
      });
      setMessage(response.data.message);
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000); 
      
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
      setMessage("");
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
          <div className="loader" href='/'>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
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

      <div className="container d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">Reset Password</h2>
          {message && <div className="alert alert-success text-center">{message}</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email" // Dodato ime za povezivanje sa formRef
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Send Reset Email
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;