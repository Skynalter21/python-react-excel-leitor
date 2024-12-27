import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';  // Estilo do Navbar

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();  // Chama a função passada para fazer o logout, limpando o estado de autenticação
    navigate('/login');  // Redireciona para a página de login
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-links">
          <li><Link to="/bem-vindo" className="navbar-link">Bem-vindo</Link></li>
          <li><Link to="/usuarios" className="navbar-link">Base de Usuários</Link></li>
        </ul>
        <button onClick={handleLogout} className="navbar-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
