import React from "react";
import { useNavigate } from "react-router-dom";

export default function Pedido({ pedido, setPedido }) {
  const navigate = useNavigate();

  const alterarQuantidade = (index, delta) => {
    const novosItens = [...pedido.itens];
    novosItens[index].quantidade += delta;
    if (novosItens[index].quantidade < 1) novosItens[index].quantidade = 1;
    setPedido({ ...pedido, itens: novosItens });
  };

  // total do pedido
  const total = pedido.itens.reduce((acc, i) => {
    // se for combo, preco já vem do combo
    return acc + parseFloat(i.preco) * i.quantidade;
  }, 0);

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Seu Pedido</h2>

      {pedido.itens.length === 0 && <p>Seu pedido está vazio.</p>}

      {pedido.itens.map((i, idx) => (
        <div key={i.id || i.id_combo || idx} className="flex justify-between mb-2 items-center">
          {/* Nome do item */}
          <span>{i.nome}</span>

          {/* Controle de quantidade */}
          <span>
            <button
              className="bg-gray-300 px-2 rounded mr-2"
              onClick={() => alterarQuantidade(idx, -1)}
            >
              -
            </button>
            {i.quantidade}
            <button
              className="bg-gray-300 px-2 rounded ml-2"
              onClick={() => alterarQuantidade(idx, 1)}
            >
              +
            </button>
          </span>

          {/* Preço do item * quantidade */}
          <span>R$ {(parseFloat(i.preco) * i.quantidade).toFixed(2)}</span>
        </div>
      ))}

      <h3 className="mt-4 text-xl font-bold">Total: R$ {total.toFixed(2)}</h3>

      <button
        className="mt-6 bg-blue-600 text-white p-4 rounded"
        onClick={() => navigate("/finalizar")}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}
