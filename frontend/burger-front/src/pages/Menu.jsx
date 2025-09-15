import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComboCard from "../components/ComboCard";
import ProdutoCard from "../components/ProdutoCard";

export default function Menu({ pedido, setPedido }) {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const prodRes = await fetch("/produtos/");
        const prodData = await prodRes.json();
        setProdutos(prodData);

        const comboRes = await fetch("/combos/");
        const comboData = await comboRes.json();
        setCombos(comboData);
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
      }
    }
    fetchData();
  }, []);

  const adicionarItem = (item, tipoItem) => {
    setPedido({
      ...pedido,
      itens: [
        ...pedido.itens,
        {
          id_produto: tipoItem === "produto" ? item.id : null,
          id_combo: tipoItem === "combo" ? item.id_combo : null,
          nome: item.nome,
          quantidade: 1,
          preco: parseFloat(item.preco),
        },
      ],
    });
  };

  const quantidadeTotal = pedido.itens.reduce((acc, i) => acc + i.quantidade, 0);
  const valorTotal = pedido.itens.reduce((acc, i) => acc + i.quantidade * i.preco, 0);

  return (
    <div className="p-8">
      {/* Barra fixa do carrinho */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">
          Menu - {tipo === "comer-aqui" ? "Comer Aqui" : "Viagem"}
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/pedido")}
        >
          Carrinho ({quantidadeTotal}) - R$ {valorTotal.toFixed(2)}
        </button>
      </div>

      <div className="mt-20">
        <h3 className="text-2xl mt-4 mb-2">Produtos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} adicionar={() => adicionarItem(p, "produto")} />
          ))}
        </div>

        <h3 className="text-2xl mt-4 mb-2">Combos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {combos.map((c) => (
            <ComboCard key={c.id_combo} combo={c} adicionar={() => adicionarItem(c, "combo")} />
          ))}
        </div>
      </div>
    </div>
  );
}
