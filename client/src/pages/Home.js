import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <div style={{padding:"40px"}}>

      <h1>📚 Study Collaboration Platform</h1>

      <p>
        Create study groups, share notes, and chat with classmates in real time.
      </p>

      <button onClick={() => navigate("/login")}>
        Login
      </button>

    </div>
  );
}

export default Home;