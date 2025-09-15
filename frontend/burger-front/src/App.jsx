import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Pedido from "./pages/Pedido";
import Finalizar from "./pages/Finalizar";
import PainelCozinha from "./pages/PainelCozinha";
import RetiradaPedidos from "./pages/RetiradaPedidos";

export default function App() {
  const [pedido, setPedido] = useState({
    id_cliente: null,
    tipo: null,
    itens: [],
  });

  const [cliente, setCliente] = useState({
    id_cliente: null,
    nome: "",
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home pedido={pedido} setPedido={setPedido} />} />
        <Route path="/menu/:tipo" element={<Menu pedido={pedido} setPedido={setPedido} />} />
        <Route path="/pedido" element={<Pedido pedido={pedido} setPedido={setPedido} />} />
        <Route
          path="/finalizar"
          element={
            <Finalizar
              pedido={pedido}
              setPedido={setPedido}
              cliente={cliente}
              setCliente={setCliente}
            />
          }
        />
        <Route path="/cozinha" element={<PainelCozinha />} />
        <Route path="/retirada" element={<RetiradaPedidos />} />
      </Routes>
    </Router>
  );
}
