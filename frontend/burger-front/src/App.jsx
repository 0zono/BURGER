import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Pedido from "./pages/Pedido";
import Finalizar from "./pages/Finalizar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:tipo" element={<Menu />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/finalizar" element={<Finalizar />} />
      </Routes>
    </Router>
  );
}

export default App;
