import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getClubs, getPlayers, deletePlayer, getGames, deleteMatch, updateMatch } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

const ManageData = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const { currentUser } = useAuth();

  const fetchClubs = useCallback(async () => {
    try {
      const clubsData = await getClubs();
      setClubs(clubsData);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    if (selectedClub) {
      try {
        const playersData = await getPlayers(selectedClub);
        setPlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
  }, [selectedClub]);

  const fetchMatches = useCallback(async () => {
    if (selectedClub) {
      try {
        const matchesData = await getGames(selectedClub);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    }
  }, [selectedClub]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  useEffect(() => {
    if (selectedClub) {
      fetchPlayers();
      fetchMatches();
    }
  }, [selectedClub, fetchPlayers, fetchMatches]);

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm("Are you sure you want to delete this player? This action cannot be undone.")) {
      try {
        await deletePlayer(selectedClub, playerId);
        alert("Player deleted successfully");
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
        alert("Failed to delete player");
      }
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      try {
        await deleteMatch(selectedClub, matchId);
        alert("Match deleted successfully");
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
        alert("Failed to delete match");
      }
    }
  };

  const handleUpdateMatch = async (matchId, newData) => {
    try {
      await updateMatch(selectedClub, matchId, newData);
      alert("Match updated successfully");
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      alert("Failed to update match");
    }
  };

  return (
    <div className="manage-data-container">
      <h2>Manage Data</h2>
      <select onChange={(e) => setSelectedClub(e.target.value)}>
        <option value="">Select a club</option>
        {clubs.map(club => (
          <option key={club.id} value={club.id}>{club.name}</option>
        ))}
      </select>
      {selectedClub && (
        <>
          <div>
            <h3>Players</h3>
            <ul>
              {players.map(player => (
                <li key={player.id}>
                  {player.fullName}
                  {currentUser && (
                    <>
                      <Link to={`/add-training/${selectedClub}/${player.id}`}>Add Training</Link>
                      <Link to={`/edit-player/${selectedClub}/${player.id}`}>Edit Player</Link>
                      <button onClick={() => handleDeletePlayer(player.id)}>Delete Player</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Matches</h3>
            <ul>
              {matches.map(match => (
                <li key={match.id}>
                  {match.date} - {match.opponent} - {match.result}
                  {currentUser && (
                    <>
                      <button onClick={() => handleUpdateMatch(match.id, { /* new match data */ })}>Edit Match</button>
                      <button onClick={() => handleDeleteMatch(match.id)}>Delete Match</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {currentUser && (
        <div>
          <Link to="/add-player" className="btn-3d">Add New Player</Link>
          <Link to="/add-match" className="btn-3d">Add New Match</Link>
        </div>
      )}
    </div>
  );
};

export default ManageData;