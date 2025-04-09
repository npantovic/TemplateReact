import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://localhost:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u Authorization zaglavlje
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Not authenticated");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header / Navbar */}
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
          <a className="navbar-brand" href="/profile">
            {user.username}
          </a>
          <div className="collapse navbar-collapse justify-content-end">
            <div className="navbar-nav">
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/profile")}>
                Profil
              </button>
              <button className="btn btn-outline-light me-2" onClick={() => navigate("/books/all")}>
                Sve knjige
              </button>
              <button
                className="btn btn-outline-light"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-dark text-white text-center">
                <h3>Welcome, {user.username}!</h3>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-4">
                    <strong>First Name:</strong>
                  </div>
                  <div className="col-8">
                    {user.first_name}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <strong>Last Name:</strong>
                  </div>
                  <div className="col-8">
                    {user.last_name}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <strong>Email:</strong>
                  </div>
                  <div className="col-8">
                    {user.email}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <strong>UCIN:</strong>
                  </div>
                  <div className="col-8">
                    {user.UCIN}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
