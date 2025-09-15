import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ pedido, setPedido }) {
  const navigate = useNavigate();

  const iniciarPedido = (tipo) => {
    setPedido({ ...pedido, tipo });
    navigate(`/menu/${tipo}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl mb-12">Bem-vindo ao Burger Totem</h1>
      <div className="flex gap-8">
        <button onClick={() => iniciarPedido("comer-aqui")} className="bg-indigo-600 p-6 rounded-lg">
          Comer Aqui
        </button>
        <button onClick={() => iniciarPedido("viagem")} className="bg-green-600 p-6 rounded-lg">
          Viagem
        </button>
      </div>
    </div>
  );
}
