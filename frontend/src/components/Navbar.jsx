import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

    },
    logoWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    logo: {
      width: "48px",
      height: "48px",
      color: "#2563eb",
    },
    companyName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#1f2937",
    },
    button: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      color: "#fff",
      backgroundColor: "#2563eb",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      textDecoration: "none",
    },
    logoutButton: {
      backgroundColor: "#2563eb",
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoWrapper}>
        <svg
          style={styles.logo}
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle
            cx="50"
            cy="50"
            r="41"
            stroke="currentColor"
            strokeWidth="18"
            fill="none"
          />
          <path d="M30 60 L50 30 L70 60 Z" fill="currentColor" />
        </svg>

        <h1 >Shubi</h1>
      </div>

      {isAuthenticated ? (
        <button
          style={{ ...styles.button, ...styles.logoutButton }}
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <NavLink to="/login" style={styles.button}>
          Login
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
