import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const formRef = useRef({
    username: "",
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    UCIN: "",
    date_of_birth: "",
    gender: "Male",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formatiraj datum rođenja
    const formattedDate = formRef.current.date_of_birth.split("-").reverse().join("-");

    try {
      // await axios.post("http://localhost:8000/api/v1/auth/singup", {
      //   username: formRef.current.username,
      //   email: formRef.current.email,
      //   password_hash: formRef.current.password_hash,
      //   first_name: formRef.current.first_name,
      //   last_name: formRef.current.last_name,
      //   UCIN: formRef.current.UCIN,
      //   date_of_birth: formattedDate,
      //   gender: formRef.current.gender,
      // });
      await axios.post("http://localhost:8000/api/v1/auth/singup", {
      ...formRef.current,
      date_of_birth: formattedDate,
      });

      setSuccess("Registration successful! Please check your email.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
      setSuccess("");
    }
  };

  const handleChange = (e) => {
    formRef.current[e.target.name] = e.target.value;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div class="loader">
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
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/register")}>
                Register
              </button>
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">Create an Account</h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                name="password_hash"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">UCIN:</label>
              <input
                type="text"
                name="UCIN"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">Date of Birth:</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Gender:</label>
                <select
                  name="gender"
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
