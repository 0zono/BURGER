// src/components/ComboCard.jsx
import React from "react";

function ComboCard({ combo, adicionar }) {
  return (
    <div className="border p-4 rounded-lg bg-gray-800 text-white">
      <h4 className="font-bold">{combo.nome}</h4>
      <p>R$ {combo.preco}</p>
      <button onClick={adicionar} className="mt-2 bg-green-600 px-4 py-2 rounded">
        Adicionar
      </button>
    </div>
  );
}

export default ComboCard; // Default export