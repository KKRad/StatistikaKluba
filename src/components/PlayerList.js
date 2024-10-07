import React from 'react';
import { Link } from 'react-router-dom';

const PlayerList = ({ clubId, players }) => {
  return (
    <div>
      <h2>Lista igrača</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            <Link to={`/club/${clubId}/player/${player.id}`}>{player.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;