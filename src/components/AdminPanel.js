// src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { getClubs, addClub, updateClub, deleteClub } from '../services/databaseService';

const AdminPanel = () => {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState('');
  const [editingClub, setEditingClub] = useState(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const clubsData = await getClubs();
    setClubs(clubsData);
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    if (newClubName.trim()) {
      await addClub({ name: newClubName.trim() });
      setNewClubName('');
      fetchClubs();
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    if (editingClub && editingClub.name.trim()) {
      await updateClub(editingClub.id, { name: editingClub.name.trim() });
      setEditingClub(null);
      fetchClubs();
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      await deleteClub(clubId);
      fetchClubs();
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Clubs</h3>
      <form onSubmit={handleAddClub}>
        <input
          type="text"
          value={newClubName}
          onChange={(e) => setNewClubName(e.target.value)}
          placeholder="New club name"
        />
        <button type="submit">Add Club</button>
      </form>
      <ul>
        {clubs.map(club => (
          <li key={club.id}>
            {editingClub && editingClub.id === club.id ? (
              <form onSubmit={handleUpdateClub}>
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingClub(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {club.name}
                <button onClick={() => setEditingClub(club)}>Edit</button>
                <button onClick={() => handleDeleteClub(club.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;