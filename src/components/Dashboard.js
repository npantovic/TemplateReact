import React from "react";

const Dashboard = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>You are successfully logged in!</p>
    </div>
  );
};

export default Dashboard;