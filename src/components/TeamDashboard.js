import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { getTeamStats } from '../services/databaseService';

const TeamDashboard = () => {
  const { clubId } = useParams();
  const [teamStats, setTeamStats] = useState(null);

  const fetchTeamStats = useCallback(async () => {
    const stats = await getTeamStats(clubId);
    setTeamStats(stats);
  }, [clubId]);

  useEffect(() => {
    fetchTeamStats();
  }, [fetchTeamStats]);

  if (!teamStats) return <div>Loading...</div>;

  const chartData = {
    labels: ['Prosečni poeni', 'Prosečni skokovi', 'Prosečne asistencije'],
    datasets: [
      {
        label: 'Timska statistika',
        data: [teamStats.averagePoints, teamStats.averageRebounds, teamStats.averageAssists],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="team-dashboard">
      <h2>Tim Dashboard</h2>
      <Bar data={chartData} />
      <p>Procenat pobeda: {teamStats.winPercentage}%</p>
    </div>
  );
};

export default TeamDashboard;