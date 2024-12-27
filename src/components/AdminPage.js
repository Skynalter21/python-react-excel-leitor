import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/admin', {
        headers: {
          'User-ID': JSON.par   se(localStorage.getItem('user')).id,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data.users); // Supondo que o backend retorna uma lista de usuários
      } else {
        alert('Acesso negado');
        window.location.href = '/';
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
