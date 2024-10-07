import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayer, getPlayerTrainings, getPlayerMatches, deleteTraining } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlayerDetails = () => {
  const { clubId, playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playerData = await getPlayer(clubId, playerId);
        if (!playerData) {
          throw new Error("Player not found");
        }
        
        setPlayer(playerData);

        const trainingsData = await getPlayerTrainings(clubId, playerId);
        setTrainings(trainingsData);

        const matchesData = await getPlayerMatches(clubId, playerId);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching player data:", error);
        setError(error.message);
      }
    };

    fetchPlayerData();
  }, [clubId, playerId]);

  const handleDeleteTraining = async (trainingId) => {
    if (!currentUser) {
      alert('You must be logged in as an admin to delete trainings.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await deleteTraining(clubId, playerId, trainingId);
        setTrainings(trainings.filter(training => training.id !== trainingId));
        // Refresh player data after deleting training
        const refreshedPlayerData = await getPlayer(clubId, playerId);
        setPlayer(refreshedPlayerData);
      } catch (error) {
        console.error('Error deleting training:', error);
        alert('Failed to delete training');
      }
    }
  };

  const filterDataByDate = (data) => {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= new Date(startDate)) &&
             (!endDate || itemDate <= new Date(endDate));
    });
  };

  const filteredTrainings = filterDataByDate(trainings);
  const filteredMatches = filterDataByDate(matches);

  const chartData = {
    labels: [...filteredTrainings, ...filteredMatches]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Bacanja',
        data: filteredTrainings
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(training => training.shotsAttempted),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Utakmice',
        data: filteredMatches
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(match => match.playerScore),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Promašaji',
        data: filteredTrainings
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(training => training.shotsMissed),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Napredak igrača',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 450,
        max: 700,
        title: {
          display: true,
          text: 'Bacanja'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 20,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Promašaji'
        }
      },
    },
  };


  if (error) return <div>Error: {error}</div>;
  if (!player) return <div>Loading...</div>;

  return (
    <div className="player-details">
      <h2>{player.fullName}</h2>
      {currentUser && (
        <>
          <Link to={`/add-training/${clubId}/${playerId}`}>Add New Training</Link>
          <Link to={`/edit-player/${clubId}/${playerId}`}>Edit Player</Link>
        </>
      )}
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="chart">
        <Line options={options} data={chartData} />
      </div>
      <div className="card">
        <h3>Statistika treninga</h3>
        <table>
          <thead>
            <tr>
              <th>Ukupno treninga</th>
              <th>Prosek bacanja</th>
              <th>Prosek promašaja</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{filteredTrainings.length}</td>
              <td>{(filteredTrainings.reduce((sum, t) => sum + t.shotsAttempted, 0) / filteredTrainings.length || 0).toFixed(2)}</td>
              <td>{(filteredTrainings.reduce((sum, t) => sum + t.shotsMissed, 0) / filteredTrainings.length || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="trainings">
        <h3>Treninzi</h3>
        <ul>
          {filteredTrainings.map(training => (
            <li key={training.id}>
              Datum: {new Date(training.date).toLocaleDateString()}, 
              Bacanja: {training.shotsAttempted}, 
              Promašaji: {training.shotsMissed}
              {currentUser && (
                <button onClick={() => handleDeleteTraining(training.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="matches">
        <h3>Utakmice</h3>
        <ul>
          {filteredMatches.map(match => (
            <li key={match.id}>
              Datum: {new Date(match.date).toLocaleDateString()}, 
              Protivnik: {match.opponent}, 
              Rezultat: {match.result}, 
              Poeni: {match.playerScore}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerDetails;