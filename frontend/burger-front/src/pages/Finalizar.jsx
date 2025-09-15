import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Finalizar.module.css";
// Ícones para feedback visual
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function Finalizar({ pedido, setPedido, cliente, setCliente }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  // --- SUA LÓGICA ORIGINAL (NÃO FOI ALTERADA) ---
  const enviarPedido = async () => {
    if (!cliente || !cliente.nome) {
      setErro("Por favor, digite seu nome para identificação.");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      let id_cliente = cliente.id_cliente || null;

      if (!id_cliente) {
        const resCliente = await fetch("/clientes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: cliente.nome }),
        });

        if (!resCliente.ok) throw new Error("Erro ao criar cliente");
        const dataCliente = await resCliente.json();
        id_cliente = dataCliente.id;
        setCliente({ ...cliente, id_cliente });
      }

      const resPedido = await fetch("/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente, itens: pedido.itens }),
      });

      if (!resPedido.ok) throw new Error("Erro ao enviar pedido");

      setSucesso(true);
      setPedido({ itens: [] }); // Limpa o pedido
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const total = pedido.itens.reduce((acc, i) => acc + parseFloat(i.preco) * i.quantidade, 0);

  const handleNewOrder = () => {
    setSucesso(false);
    setCliente({});
    navigate("/");
  };
  
  // --- TELA DE SUCESSO DEDICADA ---
  if (sucesso) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.successOverlay}>
          <FaCheckCircle size={100} className={styles.successIcon} />
          <h2 className={styles.successTitle}>Pedido Recebido!</h2>
          <p className={styles.successMessage}>
            Obrigado, {cliente.nome}! Seu pedido já está sendo preparado.
          </p>
          <button onClick={handleNewOrder} className={styles.newOrderButton}>
            Fazer Novo Pedido
          </button>
        </div>
      </div>
    );
  }

  // --- TELA PRINCIPAL DE FINALIZAÇÃO ---
  return (
    <div className={styles.pageContainer}>
      <div className={styles.checkoutCard}>
        <h2 className={styles.title}>Finalizar Pedido</h2>
        
        <label htmlFor="nome" className={styles.label}>Seu Nome</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite seu nome"
          className={styles.textInput}
          value={cliente?.nome || ""}
          onChange={(e) => setCliente({ ...(cliente || {}), nome: e.target.value })}
          disabled={loading}
        />

        <div>
          {pedido.itens.map((i, idx) => (
            <div key={`${i.id_produto || i.id_combo}-${idx}`} className={styles.summaryItem}>
              <span>{i.quantidade}x {i.nome}</span>
              <span>R$ {(parseFloat(i.preco) * i.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        
        <button className={styles.confirmButton} onClick={enviarPedido} disabled={loading || pedido.itens.length === 0}>
          {loading ? <FaSpinner className="animate-spin" /> : "Confirmar Pedido"}
        </button>

        <button className={styles.backButton} onClick={() => navigate(-1)} disabled={loading}>
          Voltar
        </button>

        {erro && <p className={styles.errorMessage}>{erro}</p>}
      </div>
    </div>
  );
}