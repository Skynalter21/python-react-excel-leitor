import React from 'react';
import Navbar from './Navbar';  // Importe a Navbar
import { useNavigate } from 'react-router-dom';
import '../styles/BemVindo.css';  // Estilo do Navbar


const BemVindo = ({ onLogout }) => {
  return (
    <div className="bemvindo-container">
      <Navbar onLogout={onLogout} />
      <div className="bemvindo-content">
        <h1>Bem-vindo!</h1>
        <p>Você está autenticado e pronto para usar o sistema.</p>
      </div>
    </div>
  );
};

export default BemVindo;
