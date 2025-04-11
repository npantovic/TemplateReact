import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Praćenje režima uređivanja korisničkog imena
  const [newUsername, setNewUsername] = useState(""); // Praćenje unosa za novo korisničko ime
  const [isEditingEmail, setIsEditingEmail] = useState(false); // Praćenje režima uređivanja email-a
  const [newEmail, setNewEmail] = useState(""); // Praćenje unosa za novi email
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://localhost:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Not authenticated");
      }
    };

    fetchUser();
  }, []);

  const handleUpdateUsername = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/auth/update-username",
        { user_uid: String(user.uid), new_username: String(newUsername) }
      );

      setUser(response.data.user); // Ažuriraj korisnika sa novim podacima
      setIsEditing(false); // Izađi iz režima uređivanja
    } catch (err) {
      console.error("Error updating username:", err.response?.data || err.message);
      alert("Failed to update username");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/auth/update-email",
        { user_uid: String(user.uid), new_email: String(newEmail) }
      );

      setUser(response.data.user); // Ažuriraj korisnika sa novim podacima
      setIsEditingEmail(false); // Izađi iz režima uređivanja
    } catch (err) {
      console.error("Error updating email:", err.response?.data || err.message);
      alert("Failed to update email");
    }
  };

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
                  <div className="col-8 d-flex align-items-center">
                    {isEditingEmail ? (
                      <input
                        type="email"
                        className="form-control me-2"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    ) : (
                      <span className="me-2">{user.email}</span>
                    )}
                    {isEditingEmail ? (
                      <>
                        <button className="btn btn-dark me-2" onClick={handleUpdateEmail}>
                          Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setIsEditingEmail(false)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          setNewEmail(user.email); // Postavi trenutni email u input polje
                          setIsEditingEmail(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <strong>Username:</strong>
                  </div>
                  <div className="col-8 d-flex align-items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control me-2"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    ) : (
                      <span className="me-2">{user.username}</span>
                    )}
                    {isEditing ? (
                      <>
                        <button className="btn btn-dark me-2" onClick={handleUpdateUsername}>
                          Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          setNewUsername(user.username); // Postavi trenutni username u input polje
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
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