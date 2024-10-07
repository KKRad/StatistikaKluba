import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getMatches, addMatch } from '../services/databaseService';

const MatchManagement = () => {
  const { clubId } = useParams();
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({ opponent: '', date: '', score: '' });

  const fetchMatches = useCallback(async () => {
    const matchesData = await getMatches(clubId);
    setMatches(matchesData);
  }, [clubId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleAddMatch = async (e) => {
    e.preventDefault();
    await addMatch(clubId, newMatch);
    setNewMatch({ opponent: '', date: '', score: '' });
    fetchMatches();
  };

  return (
    <div className="match-management">
      <h2>Upravljanje utakmicama</h2>
      <form onSubmit={handleAddMatch}>
        {/* Form inputs remain the same */}
      </form>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            {match.opponent} - {match.date} - {match.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchManagement;