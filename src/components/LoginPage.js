import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';  // Estilo do LoginPage

const LoginPage = () => {
  const [email, setEmail] = useState('');  // Guardando o email do usuário
  const [password, setPassword] = useState('');  // Guardando a senha do usuário
  const [error, setError] = useState('');  // Mensagem de erro
  const navigate = useNavigate();  // Usado para redirecionar o usuário após o login

  const handleLogin = async (e) => {
    e.preventDefault();  // Previne o comportamento padrão do formulário
    setError('');  // Limpa a mensagem de erro antes de tentar o login

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        email,   // Envia o email para o backend
        password,  // Envia a senha para o backend
      });

      if (response.status === 200 && response.data.message === 'Login bem-sucedido!') {
        // Se o login for bem-sucedido, redireciona para a página de boas-vindas
        // Opcional: Salvar o token ou ID do usuário no localStorage ou sessionStorage
        localStorage.setItem('user_id', response.data.user_id);
        navigate('/bem-vindo');
      } else {
        setError('Login falhou! Verifique suas credenciais.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao conectar ao servidor.';
      console.error('Erro no login:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        {error && <div className="error-message">{error}</div>}  {/* Exibe a mensagem de erro, se houver */}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"  // Altera o tipo do input para "email" para validação automática
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado do email
            placeholder="Digite seu email"
            required  // Torna o campo obrigatório
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Atualiza o estado da senha
            placeholder="Digite sua senha"
            required  // Torna o campo obrigatório
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
