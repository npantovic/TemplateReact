import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const [enabled2FA, setEnabled2FA] = useState(false);

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
        setEnabled2FA(response.data.enabled_2fa);
      } catch (err) {
        setError(err.response?.data?.detail || "Not authenticated");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (showQRCode && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowQRCode(false);
      setQrCodeUrl(null);
    }
  }, [countdown, showQRCode]);

  const handleUpdateUsername = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/auth/update-username",
        { user_uid: String(user.uid), new_username: String(newUsername) }
      );
      setUser(response.data.user);
      setIsEditing(false);
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
      setUser(response.data.user);
    } catch (err) {
      console.error("Error updating email:", err.response?.data || err.message);
      alert("Failed to update email");
    }
  };

  const handleActivate2FA = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/api/v1/auth/2fa/qr-code/${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const qrImageUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(qrImageUrl);
      setShowQRCode(true);
      setEnabled2FA(true);
      setCountdown(20);
    } catch (err) {
      console.error("Error fetching 2FA QR code:", err.response?.data || err.message);
      alert("Failed to generate 2FA QR code");
    }
  };

  const handleRestartPassword = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/password_reset_request",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setError("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error restarting password:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to restart password. Please try again.");
      setSuccessMessage("");
      setTimeout(() => {
        setError("");
      }, 3500);
    }
  };

  const handleDeactivate2FA = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/disable_2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnabled2FA(false); // Postavljanje stanja na deaktivirano
      setSuccessMessage(response.data.message);
      setError("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      console.error("Error disabling 2FA:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to disable 2FA. Please try again.");
      setTimeout(() => {
        setError("");
      }, 2500);
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
        {successMessage && (
          <div className="alert alert-success text-center" role="alert">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-dark text-white text-center">
                <h3>Welcome, {user.username}!</h3>
              </div>
              <div className="card-body">
                <div className="row mb-3 align-items-center">
                  <div className="col-4"><strong>First Name:</strong></div>
                  <div className="col-8">{user.first_name}</div>
                </div>
                <div className="row mb-3 align-items-center">
                  <div className="col-4"><strong>Last Name:</strong></div>
                  <div className="col-8">{user.last_name}</div>
                </div>
                <div className="row mb-3 align-items-center">
                  <div className="col-4"><strong>Email:</strong></div>
                  <div className="col-8 d-flex justify-content-between">
                    {isEditingEmail ? (
                      <>
                        <input type="email" className="form-control me-2" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <button className="btn btn-dark me-2" onClick={handleUpdateEmail}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <span>{user.email}</span>
                        <button className="btn btn-dark" onClick={() => { setNewEmail(user.email); setIsEditingEmail(true); }}>Edit</button>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <div className="col-4"><strong>Username:</strong></div>
                  <div className="col-8 d-flex justify-content-between">
                    {isEditing ? (
                      <>
                        <input type="text" className="form-control me-2" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                        <button className="btn btn-dark me-2" onClick={handleUpdateUsername}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <span>{user.username}</span>
                        <button className="btn btn-dark" onClick={() => { setNewUsername(user.username); setIsEditing(true); }}>Edit</button>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-3 align-items-center">
                  <div className="col-4"><strong>UCIN:</strong></div>
                  <div className="col-8">{user.UCIN}</div>
                </div>
                <div className="row mb-3 text-center">
                  <div className="d-flex justify-content-center mt-3">
                    {enabled2FA ? (
                      <button className="btn btn-danger" onClick={handleDeactivate2FA}>
                        Deactivate 2FA
                      </button>
                    ) : (
                      <button className="btn btn-dark" onClick={handleActivate2FA}>
                        Activate 2FA
                      </button>
                    )} &nbsp;&nbsp;
                    <button className="btn btn-dark" onClick={handleRestartPassword}>
                      Restart password
                    </button>
                  </div>
                </div>
                {showQRCode && (
                  <div className="row mb-3 text-center">
                    <div className="col">
                      <h5>Scan this QR Code with your authenticator app:</h5>
                      <p>This code will disappear in <strong>{countdown}</strong> seconds.</p>
                      <img src={qrCodeUrl} alt="2FA QR Code" className="img-fluid" style={{ maxWidth: "200px" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
