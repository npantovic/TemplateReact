import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formData.date_of_birth.split("-").reverse().join("-");

    try {
      await axios.post("http://localhost:8000/api/v1/auth/singup", {
        ...formData,
        date_of_birth: formattedDate,
      });
      setSuccess("Registration successful! Please check your email to verify your account.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            name="password_hash"
            className="form-control"
            value={formData.password_hash}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>UCIN:</label>
          <input
            type="text"
            name="UCIN"
            className="form-control"
            value={formData.UCIN}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            className="form-control"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Gender:</label>
          <select
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit" className="btn btn-dark w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;