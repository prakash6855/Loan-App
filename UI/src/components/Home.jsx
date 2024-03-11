import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/home.css";
function Home() {
  const navigate = useNavigate();

  // Function to check if the user is logged in as admin
  const isAdminLoggedIn = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});

    return cookies.token && cookies.userID && cookies.isAdmin === "true";
  };

  // Function to check if the user is logged in
  const isUserLoggedIn = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});

    return cookies.token && cookies.userID && cookies.isAdmin === "false";
  };

  return (
    <div>
      <h1>Welcome to Loan App</h1>
      <div className="button-container">
        {isAdminLoggedIn() ? (
          <button onClick={() => navigate("/admin-dashboard")}>
            Admin Dashboard
          </button>
        ) : isUserLoggedIn() ? (
          <button onClick={() => navigate("/user-dashboard")}>
            User Dashboard
          </button>
        ) : (
          <>
            <button onClick={() => navigate("/admin-login")}>
              Admin Login
            </button>
            <button onClick={() => navigate("/user-signup")}>
              User Sign Up
            </button>
            <button onClick={() => navigate("/user-login")}>User Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
