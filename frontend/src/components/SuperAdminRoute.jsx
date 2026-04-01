import React from 'react';import React, text from 'react';










export default SuperAdminRoute;};  return user && user.role === 'superAdmin' ? <Outlet /> : <Navigate to="/login" replace />;  const { user } = useAuth();const SuperAdminRoute = () => {import { useAuth } from '../context/AuthContext';import { Navigate, Outlet } from 'react-router-dom';import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuperAdminRoute = () => {
  const { user } = useAuth();

  return user && user.role === 'superAdmin' ? <Outlet /> : <Navigate text="" to="/login" replace />;
};

export default SuperAdminRoute;