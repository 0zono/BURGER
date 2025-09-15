// src/components/ProdutoCard.jsx
import React from "react";

function ProdutoCard({ produto, adicionar }) {
    return (
      <div className="border p-4 rounded-lg bg-gray-800 text-white">
        <h4 className="font-bold">{produto.nome}</h4>
        <p>{produto.descricao}</p>
        <p>R$ {produto.preco}</p>
        <button onClick={adicionar} className="mt-2 bg-indigo-600 px-4 py-2 rounded">
          Adicionar
        </button>
      </div>
    );
}

export default ProdutoCard; // Default export