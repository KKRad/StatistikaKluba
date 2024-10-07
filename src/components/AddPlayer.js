import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPlayer, getClubs } from '../services/databaseService';

const AddPlayer = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const clubsData = await getClubs();
        setClubs(clubsData);
      } catch (err) {
        setError('Greška pri dohvaćanju klubova. Molimo pokušajte ponovno.');
        console.error("Error fetching clubs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClub) {
      setError('Molimo izaberite klub');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await addPlayer(selectedClub, { fullName: playerName });
      navigate(`/club/${selectedClub}`);
    } catch (err) {
      setError('Greška pri dodavanju igrača. Molimo pokušajte ponovno.');
      console.error("Error adding player:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Učitavanje...</div>;

  return (
    <div className="bowling-bg">
      <div className="container">
        <h2>Dodaj novog igrača</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="club-select">Klub:</label>
            <select 
              id="club-select"
              value={selectedClub} 
              onChange={(e) => setSelectedClub(e.target.value)}
              required
            >
              <option value="">Izaberite klub</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="player-name">Ime i prezime igrača:</label>
            <input
              id="player-name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Unesite ime i prezime igrača"
              required
            />
          </div>
          <button type="submit" className="btn-3d" disabled={isLoading}>
            {isLoading ? 'Dodavanje...' : 'Dodaj igrača'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlayer;