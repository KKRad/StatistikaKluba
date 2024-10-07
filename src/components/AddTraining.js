import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClubs, getPlayers, addTraining } from '../services/databaseService';

const AddTraining = () => {
  const { clubId: urlClubId, playerId: urlPlayerId } = useParams();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(urlClubId || '');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(urlPlayerId || '');
  const [trainingData, setTrainingData] = useState({
    date: '',
    shotsAttempted: 0,
    shotsMissed: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchClubs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const clubsData = await getClubs();
      setClubs(clubsData);
    } catch (err) {
      setError('Failed to load clubs. Please try again.');
      console.error('Error fetching clubs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlayers = useCallback(async (clubId) => {
    if (!clubId) return;
    setIsLoading(true);
    setError('');
    try {
      const playersData = await getPlayers(clubId);
      setPlayers(playersData);
    } catch (err) {
      setError('Failed to load players. Please try again.');
      console.error('Error fetching players:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  useEffect(() => {
    if (selectedClub) {
      fetchPlayers(selectedClub);
    }
  }, [selectedClub, fetchPlayers]);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
    setSelectedPlayer('');
  };

  const handlePlayerChange = (e) => {
    setSelectedPlayer(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainingData(prev => ({
      ...prev,
      [name]: name === 'date' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClub || !selectedPlayer) {
      setError('Please select both a club and a player');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await addTraining(selectedClub, selectedPlayer, trainingData);
      navigate(`/club/${selectedClub}`);
    } catch (err) {
      setError('Failed to add training. Please try again.');
      console.error('Error adding training:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="add-training-container">
      <h2>Add New Training</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="club">Club:</label>
          <select 
            id="club" 
            value={selectedClub} 
            onChange={handleClubChange} 
            required
            disabled={urlClubId || isLoading}
          >
            <option value="">Select a club</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="player">Player:</label>
          <select 
            id="player" 
            value={selectedPlayer} 
            onChange={handlePlayerChange} 
            required
            disabled={!selectedClub || urlPlayerId || isLoading}
          >
            <option value="">Select a player</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.fullName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={trainingData.date}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="shotsAttempted">Shots Attempted:</label>
          <input
            type="number"
            id="shotsAttempted"
            name="shotsAttempted"
            value={trainingData.shotsAttempted}
            onChange={handleInputChange}
            min="0"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="shotsMissed">Shots Missed:</label>
          <input
            type="number"
            id="shotsMissed"
            name="shotsMissed"
            value={trainingData.shotsMissed}
            onChange={handleInputChange}
            min="0"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Training'}
        </button>
      </form>
    </div>
  );
};

export default AddTraining;