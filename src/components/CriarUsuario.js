import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CriarUsuario.css';

const CriarUsuario = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/users', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        alert('Usuário criado com sucesso!');
        navigate('/usuarios'); // Redireciona para a lista de usuários
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao criar usuário.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="criar-usuario-container">
      <h1>Criar Novo Usuário</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Criar Usuário</button>
      </form>
    </div>
  );
};

export default CriarUsuario;
