import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from './Menu.module.css';

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
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          Menu - {tipo === "comer-aqui" ? "Comer Aqui" : "Viagem"}
        </h1>
        <button
          className={styles.cartButton}
          onClick={() => navigate("/pedido")}
        >
          Carrinho ({quantidadeTotal}) - R$ {valorTotal.toFixed(2)}
        </button>
      </header>

      <main className={styles.mainContent}>
        <h3 className={styles.sectionTitle}>Produtos</h3>
        <div className={styles.gridContainer}>
          {produtos.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.imagePlaceholder} />
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{p.nome}</h4>
                <p className={styles.cardDescription}>
                  {p.descricao || 'Delicioso produto feito com os melhores ingredientes da casa.'}
                </p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>
                  {parseFloat(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <button className={styles.addButton} onClick={() => adicionarItem(p, "produto")}>
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className={styles.sectionTitle}>Combos</h3>
        <div className={styles.gridContainer}>
          {combos.map((c) => (
            <div key={c.id_combo} className={styles.card}>
              <div className={styles.imagePlaceholder} />
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{c.nome}</h4>
                <p className={styles.cardDescription}>
                  {c.descricao || 'O combo perfeito para matar sua fome com economia.'}
                </p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>
                  {parseFloat(c.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <button className={styles.addButton} onClick={() => adicionarItem(c, "combo")}>
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}