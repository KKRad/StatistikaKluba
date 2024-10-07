import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayer, updatePlayer, getPlayerTrainings, deleteTraining, resetPlayerStats } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

const EditPlayer = () => {
  const { clubId, playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlayerAndTrainings = async () => {
      try {
        const playerData = await getPlayer(clubId, playerId);
        setPlayer(playerData);
        const trainingsData = await getPlayerTrainings(clubId, playerId);
        setTrainings(trainingsData);
      } catch (error) {
        console.error("Error fetching player data:", error);
        alert("Failed to load player data");
      }
    };
    fetchPlayerAndTrainings();
  }, [clubId, playerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePlayer(clubId, playerId, player);
      alert("Player updated successfully");
      navigate(`/club/${clubId}/player/${playerId}`);
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Failed to update player");
    }
  };

  const handleDeleteTraining = async (trainingId) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await deleteTraining(clubId, playerId, trainingId);
        setTrainings(trainings.filter(training => training.id !== trainingId));
        
        // Refresh player data
        const refreshedPlayerData = await getPlayer(clubId, playerId);
        setPlayer(refreshedPlayerData);
      } catch (error) {
        console.error('Error deleting training:', error);
        alert('Failed to delete training');
      }
    }
  };

  const handleResetStats = async () => {
    if (window.confirm('Are you sure you want to reset this player\'s statistics? This action cannot be undone.')) {
      try {
        await resetPlayerStats(clubId, playerId);
        const refreshedPlayerData = await getPlayer(clubId, playerId);
        setPlayer(refreshedPlayerData);
        setTrainings([]);
        alert('Player statistics have been reset successfully.');
      } catch (error) {
        console.error('Error resetting player statistics:', error);
        alert('Failed to reset player statistics');
      }
    }
  };

  if (!player) return <div>Loading...</div>;
  if (!currentUser) return <div>You must be logged in to edit players.</div>;

  return (
    <div className="edit-player-container">
      <h2>Edit Player: {player.fullName}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={player.fullName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add other player fields here as needed */}
        <button type="submit">Save Changes</button>
      </form>
      
      <div className="player-stats">
        <h3>Player Statistics</h3>
        <p>Total Trainings: {player.trainingCount || 0}</p>
        <p>Average Score: {player.averageScore ? player.averageScore.toFixed(2) : 0}</p>
        <p>Average Misses: {player.averageMisses ? player.averageMisses.toFixed(2) : 0}</p>
        <button onClick={handleResetStats}>Reset Player Statistics</button>
      </div>

      <div className="trainings-list">
        <h3>Trainings</h3>
        {trainings.length === 0 ? (
          <p>No trainings recorded for this player.</p>
        ) : (
          <ul>
            {trainings.map(training => (
              <li key={training.id}>
                Date: {new Date(training.date).toLocaleDateString()},
                Shots Attempted: {training.shotsAttempted},
                Shots Missed: {training.shotsMissed}
                <button onClick={() => handleDeleteTraining(training.id)}>Delete Training</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditPlayer;