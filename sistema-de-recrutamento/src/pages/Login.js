import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
      <h1>Bem-vindo ao Portal de Oportunidades</h1>
      <p>Faça login para acessar o sistema</p>
      <Link to="/dashboard">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>Entrar</button>
      </Link>
    </div>
  );
};

export default Login;
