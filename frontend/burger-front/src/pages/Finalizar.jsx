import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Finalizar() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Pedido Finalizado!</h1>
      <p>Obrigado por usar nosso Totem.</p>
      <button className="button-primary" onClick={() => navigate("/")}>
        Voltar ao Início
      </button>
    </div>
  );
}
