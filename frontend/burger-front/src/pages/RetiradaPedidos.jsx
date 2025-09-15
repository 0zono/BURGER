import React, { useEffect, useState } from "react";
import styles from "./RetiradaPedidos.module.css";

export default function RetiradaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetchPedidos(); // Busca inicial
    const intervalId = setInterval(fetchPedidos, 5000); // Busca a cada 5 segundos
    return () => clearInterval(intervalId); // Limpa o intervalo ao sair da página
  }, []);

  const fetchPedidos = async () => {
    try {
      // Assumindo que a API pode filtrar por status e incluir dados do cliente
      const res = await fetch("/pedidos/?status=finalizado");
      if (!res.ok) throw new Error("Erro ao buscar pedidos");

      const data = await res.json();
      
      // Ordena para que o pedido mais recente apareça em destaque
      data.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));

      setPedidos(data);
      setErro(null);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível conectar ao servidor de pedidos.");
    } finally {
      setLoading(false);
    }
  };
  
  // O pedido mais recente fica em destaque, os outros na lista de espera
  const pedidoEmDestaque = pedidos[0];
  const pedidosNaLista = pedidos.slice(1);

  if (loading) return <p className={styles.message}>Carregando pedidos...</p>;
  if (erro) return <p className={styles.message}>{erro}</p>;

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.header}>Retirada de Pedidos</h2>

      {pedidos.length === 0 ? (
        <p className={styles.message}>Não há pedidos prontos para retirada.</p>
      ) : (
        <div className={styles.panelsWrapper}>
          {/* Painel de Destaque */}
          <div className={styles.callingPanel}>
            <span className={styles.callingTitle}>Pronto para Retirada</span>
            <span className={styles.callingOrderName}>{pedidoEmDestaque.cliente?.nome.split(' ')[0]}</span>
            <span className={styles.callingOrderNumber}>Pedido #{pedidoEmDestaque.id_pedido}</span>
          </div>

          {/* Painel de Lista de Espera */}
          <div className={styles.readyPanel}>
            <h3 className={styles.readyTitle}>Aguardando</h3>
            <ul className={styles.readyList}>
              {pedidosNaLista.map(p => (
                <li key={p.id_pedido} className={styles.readyListItem}>
                  <span>#{p.id_pedido}</span>
                  <span>{p.cliente?.nome.split(' ')[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}