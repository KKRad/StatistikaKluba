import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import ClubDetails from './components/ClubDetails';
import PlayerDetails from './components/PlayerDetails';
import AddPlayer from './components/AddPlayer';
import AddMatch from './components/AddMatch';
import AddTraining from './components/AddTraining';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ManageData from './components/ManageData';
import PrivateRoute from './components/PrivateRoute';
import EditPlayer from './components/EditPlayer';
import EditMatch from './components/EditMatch';
import NotFound from './components/NotFound'; // Dodajte ovu komponentu

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/club/:clubId" element={<ClubDetails />} />
            <Route path="/club/:clubId/player/:playerId" element={<PlayerDetails />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/add-player" element={<PrivateRoute><AddPlayer /></PrivateRoute>} />
            <Route path="/add-match" element={<PrivateRoute><AddMatch /></PrivateRoute>} />
            <Route path="/add-training" element={<PrivateRoute><AddTraining /></PrivateRoute>} />
            <Route path="/add-training/:clubId/:playerId" element={<PrivateRoute><AddTraining /></PrivateRoute>} />
            <Route path="/manage-data" element={<PrivateRoute><ManageData /></PrivateRoute>} />
            <Route path="/edit-player/:clubId/:playerId" element={<PrivateRoute><EditPlayer /></PrivateRoute>} />
            <Route path="/edit-match/:clubId/:matchId" element={<PrivateRoute><EditMatch /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} /> {/* Dodajte ovu rutu za nepostojeće stranice */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;