import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayers, getGames } from '../services/databaseService';

const Dashboard = () => {
  const { clubId } = useParams();
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const playersData = await getPlayers(clubId);
      const gamesData = await getGames(clubId);
      setPlayers(playersData);
      setGames(gamesData);
    };
    fetchData();
  }, [clubId]);

  const calculatePlayerStats = () => {
    return players.map(player => {
      const playerGames = games.filter(game => game.playerId === player.id);
      const totalScore = playerGames.reduce((sum, game) => sum + game.score, 0);
      const averageScore = playerGames.length > 0 ? totalScore / playerGames.length : 0;
      const bestScore = playerGames.length > 0 ? Math.max(...playerGames.map(game => game.score)) : 0;
      
      return {
        ...player,
        gamesPlayed: playerGames.length,
        averageScore,
        bestScore
      };
    });
  };

  const playerStats = calculatePlayerStats();

  return (
    <div className="dashboard">
      <h2>Statistika kluba</h2>
      <table>
        <thead>
          <tr>
            <th>Igrač</th>
            <th>Broj igara</th>
            <th>Prosečan rezultat</th>
            <th>Najbolji rezultat</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map(player => (
            <tr key={player.id}>
              <td>{player.fullName}</td>
              <td>{player.gamesPlayed}</td>
              <td>{player.averageScore.toFixed(2)}</td>
              <td>{player.bestScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;