import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubDetails, getPlayers, getGames } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

const ClubDetails = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const refreshData = useCallback(async () => {
    try {
      console.log("Fetching club details for clubId:", clubId);
      const clubData = await getClubDetails(clubId);
      console.log("Club data received:", clubData);
      setClub(clubData);

      console.log("Fetching players for clubId:", clubId);
      const playersData = await getPlayers(clubId);
      console.log("Players data received:", playersData);
      setPlayers(playersData);

      console.log("Fetching games for clubId:", clubId);
      const gamesData = await getGames(clubId);
      console.log("Games data received:", gamesData);
      setGames(gamesData);
    } catch (err) {
      console.error("Error fetching club data: ", err);
      setError(`Greška pri učitavanju podataka o klubu: ${err.message}`);
    }
  }, [clubId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const calculatePlayerStats = (player) => {
    const playerGames = games.filter(game => game.playerScores.some(score => score.playerId === player.id));
    const totalGames = playerGames.length;
    const totalShots = playerGames.reduce((sum, game) => {
      const playerScore = game.playerScores.find(score => score.playerId === player.id);
      return sum + (playerScore ? playerScore.shotsAttempted : 0);
    }, 0);
    const totalMisses = playerGames.reduce((sum, game) => {
      const playerScore = game.playerScores.find(score => score.playerId === player.id);
      return sum + (playerScore ? playerScore.shotsMissed : 0);
    }, 0);
    const bestScore = Math.max(...playerGames.map(game => {
      const playerScore = game.playerScores.find(score => score.playerId === player.id);
      return playerScore ? playerScore.shotsAttempted - playerScore.shotsMissed : 0;
    }), 0);

    return {
      totalGames,
      averageScore: totalGames > 0 ? (totalShots - totalMisses) / totalGames : 0,
      averageMisses: totalGames > 0 ? totalMisses / totalGames : 0,
      bestScore
    };
  };

  if (error) return <div>Error: {error}</div>;
  if (!club) return <div>Loading...</div>;

  return (
    <div className="bowling-bg">
      <div className="container">
        <h2>{club.name}</h2>
        <div className="card">
          <h3>Igrači:</h3>
          {players.map(player => (
            <Link key={player.id} to={`/club/${clubId}/player/${player.id}`} className="btn-3d">
              {player.fullName}
            </Link>
          ))}
        </div>
        <div className="card">
          <h3>Statistika treninga</h3>
          <table>
            <thead>
              <tr>
                <th>Igrač</th>
                <th>Ukupno treninga</th>
                <th>Prosek bacanja</th>
                <th>Prosek promašaja</th>
                <th>Najbolji rezultat</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id}>
                  <td>{player.fullName}</td>
                  <td>{player.trainingCount || 0}</td>
                  <td>{player.averageScore ? player.averageScore.toFixed(2) : 0}</td>
                  <td>{player.averageMisses ? player.averageMisses.toFixed(2) : 0}</td>
                  <td>{player.bestTrainingScore || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Statistika utakmica</h3>
          <table>
            <thead>
              <tr>
                <th>Igrač</th>
                <th>Ukupno utakmica</th>
                <th>Prosek bacanja</th>
                <th>Prosek promašaja</th>
                <th>Najbolji rezultat</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => {
                const stats = calculatePlayerStats(player);
                return (
                  <tr key={player.id}>
                    <td>{player.fullName}</td>
                    <td>{stats.totalGames}</td>
                    <td>{stats.averageScore.toFixed(2)}</td>
                    <td>{stats.averageMisses.toFixed(2)}</td>
                    <td>{stats.bestScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {currentUser && (
          <div>
            <Link to={`/add-player`} className="btn-3d">Dodaj novog igrača</Link>
            <Link to={`/add-match`} className="btn-3d">Dodaj novu utakmicu</Link>
            <Link to={`/add-training`} className="btn-3d">Dodaj novi trening</Link>
          </div>
        )}
        <button onClick={refreshData} className="btn-3d">Osvježi podatke</button>
      </div>
    </div>
  );
};

export default ClubDetails;