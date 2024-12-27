import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BemVindo from './components/BemVindo';
import LoginPage from './components/LoginPage'; // Importe a página de login
import Navbar from './components/Navbar'; // Importe a página de login
import Usuarios from './components/Usuarios';
import CriarUsuario from './components/CriarUsuario';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // Simula um estado de autenticação

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Redireciona para a página de login após o logout
    window.location.href = '/login';  // Pode ser usado para forçar o redirecionamento para o login
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} /> {/* Rota para a página de login */}
        <Route path="/bem-vindo" element={<BemVindo onLogout={handleLogout} />} /> {/* Rota para a página de boas-vindas */}
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/novo" element={<CriarUsuario />} />
      </Routes>
    </Router>
  );
};

export default App;
