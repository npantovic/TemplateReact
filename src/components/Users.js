import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/all_users",
          {}, // Prazno telo jer ruta ne zahteva podatke
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Dodaj token za autentifikaciju
            },
          }
        );
        setUsers(response.data); // Postavi korisnike u state
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">All Users</h1>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/login")}
        >
          Back to Login
        </button>
      </div>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "bg-success"
                          : "bg-primary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;