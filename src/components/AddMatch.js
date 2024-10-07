import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClubs, getPlayers, addMatch } from '../services/databaseService';

const AddMatch = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [players, setPlayers] = useState([]);
  const [matchData, setMatchData] = useState({
    date: '',
    opponent: '',
    playerScores: [],
  });

  useEffect(() => {
    const fetchClubs = async () => {
      const clubsData = await getClubs();
      setClubs(clubsData);
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    if (selectedClub) {
      const fetchPlayers = async () => {
        const playersData = await getPlayers(selectedClub);
        setPlayers(playersData);
      };
      fetchPlayers();
    }
  }, [selectedClub]);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
    setMatchData(prev => ({ ...prev, playerScores: [] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatchData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerScoreChange = (index, field, value) => {
    setMatchData(prev => {
      const newPlayerScores = [...prev.playerScores];
      newPlayerScores[index] = { ...newPlayerScores[index], [field]: value };
      return { ...prev, playerScores: newPlayerScores };
    });
  };

  const handleAddPlayer = () => {
    if (matchData.playerScores.length < 6) {
      setMatchData(prev => ({
        ...prev,
        playerScores: [...prev.playerScores, { playerId: '', shotsAttempted: 0, shotsMissed: 0, wonSet: false }]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (matchData.playerScores.length !== 6) {
      alert('Please select exactly 6 players');
      return;
    }
    try {
      const totalPins = matchData.playerScores.reduce((sum, score) => sum + (score.shotsAttempted - score.shotsMissed), 0);
      await addMatch(selectedClub, { ...matchData, totalPins });
      alert('Match added successfully');
      navigate(`/club/${selectedClub}`);
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Failed to add match');
    }
  };

  return (
    <div className="add-match-container">
      <h2>Add New Match</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="club">Club:</label>
          <select id="club" value={selectedClub} onChange={handleClubChange} required>
            <option value="">Select a club</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={matchData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="opponent">Opponent:</label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            value={matchData.opponent}
            onChange={handleInputChange}
            required
          />
        </div>
        <h3>Player Scores</h3>
        {matchData.playerScores.map((score, index) => (
          <div key={index} className="player-score">
            <select
              value={score.playerId}
              onChange={(e) => handlePlayerScoreChange(index, 'playerId', e.target.value)}
              required
            >
              <option value="">Select a player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>{player.fullName}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Shots Attempted"
              value={score.shotsAttempted}
              onChange={(e) => handlePlayerScoreChange(index, 'shotsAttempted', Number(e.target.value))}
              required
              min="0"
            />
            <input
              type="number"
              placeholder="Shots Missed"
              value={score.shotsMissed}
              onChange={(e) => handlePlayerScoreChange(index, 'shotsMissed', Number(e.target.value))}
              required
              min="0"
            />
            <label>
              <input
                type="checkbox"
                checked={score.wonSet}
                onChange={(e) => handlePlayerScoreChange(index, 'wonSet', e.target.checked)}
              />
              Won Set
            </label>
          </div>
        ))}
        {matchData.playerScores.length < 6 && (
          <button type="button" onClick={handleAddPlayer}>Add Player</button>
        )}
        <div>
          <strong>Total Pins: </strong>
          {matchData.playerScores.reduce((sum, score) => sum + (score.shotsAttempted - score.shotsMissed), 0)}
        </div>
        <button type="submit">Add Match</button>
      </form>
    </div>
  );
};

export default AddMatch;