// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role?.toLowerCase() !== 'admin') {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;