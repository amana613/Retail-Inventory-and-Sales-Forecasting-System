import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SuperAdminRoute = () => {
  const { user } = useContext(AuthContext);

  return user && user.role === 'superAdmin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default SuperAdminRoute;
