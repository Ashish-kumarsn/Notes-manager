import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, handleLogout }) => {
  const nav = useNavigate();
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>Notes Manager</h1>
      <div style={styles.links}>
        {!user ? (
          <>
            <span 
              style={{
                ...styles.link,
                textDecoration: location.pathname === "/login" ? "underline" : "none"
              }}
              onClick={() => nav("/login")}
            >
              Login
            </span>
            <span 
              style={{
                ...styles.link,
                textDecoration: location.pathname === "/register" ? "underline" : "none"
              }}
              onClick={() => nav("/register")}
            >
              Register
            </span>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#5c4df0",
    color: "#fff",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  button: {
    backgroundColor: "#ff4d4d",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;