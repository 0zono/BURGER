import React, { useEffect, useState } from "react";

export default function PainelCozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/pedidos/");
      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = await res.json();
      // Filtra apenas pedidos pendentes
      setPedidos(data.filter(p => p.status === "pendente"));
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finalizarPedido = async (id_pedido) => {
    try {
      const res = await fetch(`/pedidos/${id_pedido}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "finalizado" }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar pedido");
      // Atualiza lista
      setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Carregando pedidos...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Painel da Cozinha</h2>
      {pedidos.length === 0 && <p>Não há pedidos pendentes.</p>}
      {pedidos.map(p => (
        <div key={p.id_pedido} className="flex justify-between mb-2 items-center border p-2 rounded">
          <span>Pedido #{p.id_pedido}</span>
          <span>Status: {p.status}</span>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => finalizarPedido(p.id_pedido)}
          >
            Finalizar
          </button>
        </div>
      ))}
    </div>
  );
}
