import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Header / Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div class="loader" onClick={() => navigate("/")}>
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
              <button className="btn btn-outline-light me-2" onClick={handleHomeClick}>
                Home
              </button>
              <button className="btn btn-outline-light me-2" onClick={handleLoginClick}>
                Login
              </button>
              <button className="btn btn-outline-light me-2" onClick={handleRegisterClick}>
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container text-center mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h1 className="display-4 mb-4">Welcome to Our Application</h1>
            <p className="lead">
              A modern platform to connect, share, and grow. Start your journey now!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
