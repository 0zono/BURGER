import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Finalizar({ pedido, setPedido, cliente, setCliente }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const enviarPedido = async () => {
    if (!cliente || !cliente.nome) {
      setErro("Nome do cliente é obrigatório");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      // Garante que temos o ID do cliente
      let id_cliente = cliente.id_cliente || null;

      // Se cliente não tiver ID, cria no backend
      if (!id_cliente) {
        const resCliente = await fetch("/clientes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: cliente.nome }),
        });

        if (!resCliente.ok) {
          const data = await resCliente.json();
          throw new Error(data.msg || "Erro ao criar cliente");
        }

        const dataCliente = await resCliente.json();
        id_cliente = dataCliente.id;
        setCliente({ ...cliente, id_cliente });
      }

      // Cria o pedido no backend
      const resPedido = await fetch("/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente,
          itens: pedido.itens,
        }),
      });

      if (!resPedido.ok) {
        const data = await resPedido.json();
        throw new Error(data.msg || "Erro ao enviar pedido");
      }

      setSucesso(true);
      setPedido({ itens: [] }); // limpa o pedido
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = pedido.itens.reduce(
    (acc, i) => acc + parseFloat(i.preco) * i.quantidade,
    0
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Finalizar Pedido</h2>

      {/* Campo para o nome do cliente (sempre visível) */}
      <input
        type="text"
        placeholder="Digite seu nome"
        className="border p-2 mb-4 w-full"
        value={cliente?.nome || ""}
        onChange={(e) =>
          setCliente({ ...(cliente || {}), nome: e.target.value })
        }
      />

      {pedido.itens.length === 0 && <p>Seu pedido está vazio.</p>}

      {pedido.itens.length > 0 && (
        <>
          {pedido.itens.map((i, idx) => (
            <div
              key={`${i.id_produto || i.id_combo}-${idx}`}
              className="flex justify-between mb-2"
            >
              <span>{i.nome}</span>
              <span>{i.quantidade}</span>
              <span>R$ {(parseFloat(i.preco) * i.quantidade).toFixed(2)}</span>
            </div>
          ))}

          <h3 className="mt-4 text-xl font-bold">
            Total: R$ {total.toFixed(2)}
          </h3>

          <button
            className="mt-6 bg-green-600 text-white p-4 rounded"
            onClick={enviarPedido}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Confirmar Pedido"}
          </button>
        </>
      )}

      {erro && <p className="text-red-600 mt-2">{erro}</p>}
      {sucesso && <p className="text-green-600 mt-2">Pedido enviado com sucesso!</p>}

      <button
        className="mt-4 bg-gray-500 text-white p-2 rounded"
        onClick={() => navigate("/menu/comer-aqui")}
      >
        Voltar ao Menu
      </button>
    </div>
  );
}
