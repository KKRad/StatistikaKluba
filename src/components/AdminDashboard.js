import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="bowling-bg">
      <div className="container">
        <div className="card">
          <h2>Admin Dashboard</h2>
          <p>Dobrodošli na admin dashboard. Ovde možete upravljati klubovima, igračima i utakmicama.</p>
          <div className="admin-actions">
            <Link to="/add-player" className="btn-3d">Dodaj novog igrača</Link>
            <Link to="/add-match" className="btn-3d">Dodaj novu utakmicu</Link>
            <Link to="/add-training" className="btn-3d">Dodaj novi trening</Link>
            <Link to="/manage-data" className="btn-3d">Upravljaj podacima</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;