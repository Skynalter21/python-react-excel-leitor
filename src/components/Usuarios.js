import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);  // Armazena os usuários
  const [loading, setLoading] = useState(true);  // Controla o estado de carregamento
  const navigate = useNavigate();

  // Função para buscar os usuários
  const fetchUsers = async () => {
    try {
      // Fazendo a requisição GET para a rota do backend
      const response = await axios.get('http://127.0.0.1:5000/api/users');
      console.log('Usuários retornados:', response.data);  // Log para ver os dados retornados
      setUsers(response.data);  // Atualiza o estado com os usuários retornados
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      // Você pode também atualizar o estado de erro se necessário
    } finally {
      setLoading(false);  // Após o carregamento, define o loading como false
    }
  };

  // Chama a função de fetchUsers quando o componente for montado
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para redirecionar para a criação de um novo usuário
  const handleCreateUser = () => {
    navigate('/usuarios/novo');  // Rota para criação de um novo usuário
  };

  if (loading) {
    return <p>Carregando...</p>;  // Exibe uma mensagem enquanto os usuários estão sendo carregados
  }

  return (
    <div className="usuarios-container">
      <h1>Usuários</h1>
      {users.length > 0 ? (
        <ul className="usuarios-lista">
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <div className="usuarios-sem-dados">
          <p>Nenhum usuário encontrado.</p>
          <button onClick={handleCreateUser}>Criar Novo Usuário</button>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
