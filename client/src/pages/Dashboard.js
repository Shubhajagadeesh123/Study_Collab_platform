import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return(

    <div style={{padding:"40px"}}>

      <h1>Welcome to Study Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

    </div>

  );
}

export default Dashboard;