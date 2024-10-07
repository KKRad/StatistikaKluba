import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  console.log("PrivateRoute rendered, currentUser:", currentUser);
  
  return currentUser ? children : <Navigate to="/admin-login" />;
};

export default PrivateRoute;