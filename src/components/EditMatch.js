import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, updateMatch } from '../services/databaseService';

const EditMatch = () => {
  const { clubId, matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const matchData = await getMatch(clubId, matchId);
        setMatch(matchData);
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };
    fetchMatch();
  }, [clubId, matchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatch(prevMatch => ({ ...prevMatch, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMatch(clubId, matchId, match);
      alert('Match updated successfully');
      navigate('/manage-data');
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Failed to update match');
    }
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Match</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={match.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="opponent">Opponent:</label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            value={match.opponent}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="result">Result:</label>
          <input
            type="text"
            id="result"
            name="result"
            value={match.result}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Match</button>
      </form>
    </div>
  );
};

export default EditMatch;