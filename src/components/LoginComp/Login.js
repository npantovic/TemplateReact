import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const formRef = useRef({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [show2FA, setShow2FA] = useState(false); // Dodata promenljiva za kontrolu prikaza 2FA
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleCodeChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const newCode = [...code];

    if (e.key === "Backspace") {
      e.preventDefault();

      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm2FACode = async (e) => {
    e.preventDefault();
  
    const finalCode = code.join("");
    console.log("Uneti 2FA kod:", finalCode);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/if2falogin", {
        otp_code: finalCode,
        email: localStorage.getItem("email"),
      });
      localStorage.setItem("access_token", response.data.access_token);
      setError("");
      navigate("/profile");
    } catch (err) {
      console.log("Error response:", err.response?.data);
      setError(err.response?.data?.detail || "2FA verification failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email: formRef.current.email,
        password_hash: formRef.current.password,
      });

      if (response.data.requires_2fa) {
        setShow2FA(true);
        setError("");
        localStorage.setItem("email", response.data.email);
      } else {
        localStorage.setItem("access_token", response.data.access_token);
        setError("");
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    formRef.current[e.target.name] = e.target.value;
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

      {/* Login Form */}
      <div className="container d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "80vh" }}>
        {!show2FA && (
        <div className="card p-4 shadow-lg mb-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            {/* <a>
              Forgot your password? <span className="text-primary" onClick={() => navigate("/reset-password")}>Reset it here</span>
            </a> */}
            <button type="submit" className="btn btn-dark w-100">
              Login
            </button>
          </form>
        </div>
        )}

        {/* 2FA Code Input */}
        {show2FA && (
          <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
            <h5 className="text-center mb-3">Unesite 2FA kod</h5>
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleConfirm2FACode}>
              <div className="d-flex justify-content-between">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className="form-control text-center mx-1"
                    style={{ width: "45px", fontSize: "1.5rem" }}
                    value={code[index]}
                    onChange={(e) => handleCodeChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-dark w-100 mt-3">
                Potvrdi
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;