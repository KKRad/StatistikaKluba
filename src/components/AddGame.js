import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addGame, getPlayers } from '../services/databaseService';

const AddGame = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData = await getPlayers(clubId);
      setPlayers(playersData);
    };
    fetchPlayers();
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGame(clubId, { 
        playerId: selectedPlayer, 
        score: Number(score), 
        date: new Date(date) 
      });
      navigate(`/club/${clubId}`);
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <div className="add-game">
      <h2>Dodaj novu igru</h2>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedPlayer} 
          onChange={(e) => setSelectedPlayer(e.target.value)}
          required
        >
          <option value="">Izaberi igrača</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>{player.fullName}</option>
          ))}
        </select>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Rezultat"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Dodaj igru</button>
      </form>
    </div>
  );
};

export default AddGame;