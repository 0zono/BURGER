import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Pedido.module.css";
// Ícone para o botão de remover
import { FaTrash } from "react-icons/fa";

export default function Pedido({ pedido, setPedido }) {
  const navigate = useNavigate();

  // --- LÓGICA APRIMORADA ---
  const alterarQuantidade = (index, delta) => {
    const novosItens = [...pedido.itens];
    const itemAtual = novosItens[index];
    
    // Se a quantidade for 1 e o usuário clicar em "-", remove o item
    if (itemAtual.quantidade === 1 && delta === -1) {
      removerItem(index);
      return;
    }
    
    itemAtual.quantidade += delta;
    setPedido({ ...pedido, itens: novosItens });
  };
  
  // Nova função para remover um item
  const removerItem = (indexParaRemover) => {
    const novosItens = pedido.itens.filter((_, index) => index !== indexParaRemover);
    setPedido({ ...pedido, itens: novosItens });
  };

  const total = pedido.itens.reduce((acc, i) => {
    return acc + parseFloat(i.preco) * i.quantidade;
  }, 0);

  const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Seu Pedido</h2>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          &larr; Voltar ao Cardápio
        </button>
      </header>

      {pedido.itens.length === 0 ? (
        <p className={styles.emptyCartMessage}>Seu pedido está vazio.</p>
      ) : (
        <div className={styles.contentWrapper}>
          <div className={styles.itemsList}>
            {pedido.itens.map((item, idx) => {
              const itemTotal = (parseFloat(item.preco) * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              return (
                <div key={item.id_produto || item.id_combo || idx} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.nome}</span>
                  <div className={styles.quantityControl}>
                    <button className={styles.quantityButton} onClick={() => alterarQuantidade(idx, -1)}>-</button>
                    <span className={styles.quantityDisplay}>{item.quantidade}</span>
                    <button className={styles.quantityButton} onClick={() => alterarQuantidade(idx, 1)}>+</button>
                  </div>
                  <span className={styles.itemPrice}>{itemTotal}</span>
                  <button className={styles.removeButton} onClick={() => removerItem(idx)}>
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Resumo</h3>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{totalFormatado}</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={() => navigate("/finalizar")}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}