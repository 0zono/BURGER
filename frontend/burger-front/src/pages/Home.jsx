import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineFoodBank, MdOutlineShoppingBag } from "react-icons/md";

// 1. Importe o arquivo CSS Module
import styles from './Home.module.css';

// Lembre-se de instalar os ícones, se ainda não o fez: npm install react-icons

export default function Home({ pedido, setPedido }) {
  const navigate = useNavigate();

  const iniciarPedido = (tipo) => {
    setPedido({ ...pedido, tipo });
    navigate(`/menu/${tipo}`);
  };

  return (
    // 2. Aplique a classe do container principal
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>
          Bem-vindo ao <span>Burger Totem</span>
        </h1>
        <p className={styles.subtitle}>
          Para começar, escolha uma opção abaixo.
        </p>
      </div>

      <div className={styles.optionsContainer}>
        
        <button
          onClick={() => iniciarPedido("comer-aqui")}
          // 3. Combine a classe base com a classe de cor
          className={`${styles.optionCard} ${styles.indigo}`}
        >
          <MdOutlineFoodBank className={styles.icon} size={100} />
          <span className={styles.cardTitle}>Comer Aqui</span>
        </button>

        <button
          onClick={() => iniciarPedido("viagem")}
          className={`${styles.optionCard} ${styles.green}`}
        >
          <MdOutlineShoppingBag className={styles.icon} size={100} />
          <span className={styles.cardTitle}>Para Viagem</span>
        </button>
        
      </div>
    </div>
  );
}