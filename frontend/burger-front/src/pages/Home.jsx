import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Bem-vindo ao Burger Totem</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        <button className="button-primary" onClick={() => navigate("/menu/comer-aqui")}>
          Comer aqui
        </button>
        <button className="button-secondary" onClick={() => navigate("/menu/viagem")}>
          Viagem
        </button>
      </div>
    </div>
  );
}
