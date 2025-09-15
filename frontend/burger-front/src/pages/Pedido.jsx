import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Pedido() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Seu Pedido</h1>
      <p>Aqui você adiciona itens ao pedido...</p>
      <button className="button-primary" onClick={() => navigate("/finalizar")}>
        Finalizar Pedido
      </button>
    </div>
  );
}
