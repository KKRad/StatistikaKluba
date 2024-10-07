import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClubs } from '../services/databaseService';

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsData = await getClubs();
        setClubs(clubsData);
      } catch (err) {
        console.error("Error fetching clubs: ", err);
        setError("Greška pri učitavanju klubova");
      }
    };

    fetchClubs();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bowling-bg">
      <div className="container">
        <h1>Kuglački klubovi</h1>
        <div className="card">
          {clubs.map(club => (
            <Link key={club.id} to={`/club/${club.id}`} className="btn-3d">{club.name}</Link>
          ))}
        </div>
        <Link to="/admin-login" className="btn-3d">Admin prijava</Link>
      </div>
    </div>
  );
};

export default Home;