import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Menu() {
  const [produtos, setProdutos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Tipo de pedido: "comer-aqui" ou "viagem"
  const tipoPedido = location.pathname.includes("comer-aqui")
    ? "Comer aqui"
    : "Viagem";

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosRes = await fetch("/produtos");
        const produtosData = await produtosRes.json();
        setProdutos(produtosData);

        const combosRes = await fetch("/combos");
        const combosData = await combosRes.json();
        setCombos(combosData);

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Carregando menu...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Menu - {tipoPedido}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.map((p) => (
            <div
              key={p.id_produto}
              className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{p.nome}</h3>
              <p className="mb-2">R$ {p.preco.toFixed(2)}</p>
              <button
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
                onClick={() =>
                  navigate("/pedido", { state: { produto: p, tipoPedido } })
                }
              >
                Adicionar ao pedido
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Combos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((c) => (
            <div
              key={c.id_combo}
              className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{c.nome}</h3>
              <p className="mb-2">R$ {c.preco.toFixed(2)}</p>
              <button
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                onClick={() =>
                  navigate("/pedido", { state: { combo: c, tipoPedido } })
                }
              >
                Adicionar ao pedido
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
