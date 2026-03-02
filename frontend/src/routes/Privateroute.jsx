import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized (e.g. user trying to access admin)
    // Redirect to their appropriate dashboard or a "not authorized" page
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard1' : '/user/dashboard'} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
