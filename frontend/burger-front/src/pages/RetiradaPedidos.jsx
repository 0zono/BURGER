import React, { useEffect, useState } from "react";

export default function RetiradaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState({});
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
      // Filtra apenas pedidos finalizados (prontos para retirada)
      const finalizados = data.filter(p => p.status === "finalizado");
      setPedidos(finalizados);

      // Busca os clientes
      const clientesMap = {};
      for (let p of finalizados) {
        const resCliente = await fetch(`/clientes/${p.id_cliente}`);
        if (resCliente.ok) {
          const c = await resCliente.json();
          clientesMap[p.id_cliente] = c.nome;
        }
      }
      setClientes(clientesMap);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando pedidos...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Pedidos Prontos para Retirada</h2>
      {pedidos.length === 0 && <p>Não há pedidos prontos para retirada.</p>}
      {pedidos.map(p => (
        <div key={p.id_pedido} className="flex justify-between mb-2 items-center border p-2 rounded">
          <span>Pedido #{p.id_pedido}</span>
          <span>Cliente: {clientes[p.id_cliente] || "Carregando..."}</span>
          <span>Status: {p.status}</span>
        </div>
      ))}
    </div>
  );
}
