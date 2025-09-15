import React, { useEffect, useState } from "react";
import styles from "./PainelCozinha.module.css";

export default function PainelCozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // --- MELHORIA: ATUALIZAÇÃO EM TEMPO REAL (POLLING) ---
  useEffect(() => {
    // Busca os pedidos a primeira vez
    fetchPedidos();

    // Configura um intervalo para buscar novos pedidos a cada 10 segundos
    const intervalId = setInterval(fetchPedidos, 10000); // 10000 ms = 10s

    // Função de limpeza: para o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  const fetchPedidos = async () => {
    // Não mostra "Carregando..." em buscas subsequentes para não piscar a tela
    // setLoading(true); 
    try {
      const res = await fetch("/pedidos/");
      if (!res.ok) throw new Error("Erro na rede ao buscar pedidos");
      const data = await res.json();
      
      // Filtra apenas pedidos pendentes
      const pedidosPendentes = data.filter(p => p.status === "pendente");
      setPedidos(pedidosPendentes);
      setErro(null); // Limpa erros anteriores se a busca for bem-sucedida
    } catch (err) {
      console.error(err);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false); // Só desativa o loading inicial
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
      
      // Remove o pedido da lista localmente para uma resposta visual instantânea
      setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className={styles.loadingMessage}>Carregando pedidos...</p>;
  if (erro) return <p className={styles.errorMessage}>{erro}</p>;

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.header}>Painel da Cozinha</h2>
      
      {pedidos.length === 0 ? (
        <p className={styles.noOrdersMessage}>Não há pedidos pendentes no momento.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {pedidos.map(p => (
            <div key={p.id_pedido} className={styles.orderTicket}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketId}>#{p.id_pedido}</span>
                {/* Opcional: Mostrar o nome do cliente, se a API retornar */}
                <span className={styles.ticketTime}>{p.cliente?.nome || "Cliente"}</span>
              </div>
              <ul className={styles.itemsList}>
                {/* Assumindo que a API retorna os itens dentro de cada pedido */}
                {p.itens?.map((item, index) => (
                  <li key={index} className={styles.item}>
                    <span className={styles.itemQuantity}>{item.quantidade}x</span>
                    <span>{item.nome}</span>
                  </li>
                ))}
              </ul>
              <button
                className={styles.finishButton}
                onClick={() => finalizarPedido(p.id_pedido)}
              >
                Finalizar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}