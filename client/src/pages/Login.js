import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {

    if (!username) {
      alert("Please enter a username");
      return;
    }

    localStorage.setItem("user", username);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Study Platform Login</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;