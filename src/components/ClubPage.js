import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubDetails, getPlayers } from '../services/databaseService';

const ClubPage = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchClubData = async () => {
      const clubData = await getClubDetails(clubId);
      setClub(clubData);
      const playersData = await getPlayers(clubId);
      setPlayers(playersData);
    };
    fetchClubData();
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  return (
    <div className="club-page">
      <h1>{club.name}</h1>
      <h2>Igrači</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            <Link to={`/club/${clubId}/player/${player.id}`}>{player.fullName}</Link>
          </li>
        ))}
      </ul>
      <Link to={`/club/${clubId}/add-player`}>Dodaj novog igrača</Link>
      <h2>Upravljanje</h2>
      <ul>
        <li><Link to={`/club/${clubId}/add-game`}>Dodaj novu igru</Link></li>
        <li><Link to={`/club/${clubId}/dashboard`}>Statistika</Link></li>
      </ul>
    </div>
  );
};

export default ClubPage;