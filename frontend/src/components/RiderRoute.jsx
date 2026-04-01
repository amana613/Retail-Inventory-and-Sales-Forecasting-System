import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RiderRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'rider') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RiderRoute;
