import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/databaseService';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAdmin(email, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Neuspešna prijava. Proverite vaše kredencijale.');
    }
  };

  return (
    <div className="bowling-bg">
      <div className="container">
        <div className="card">
          <h2>Admin Prijava</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lozinka"
              required
            />
            <button type="submit" className="btn-3d">Prijavi se</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;