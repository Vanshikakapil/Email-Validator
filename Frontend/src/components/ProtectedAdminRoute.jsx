import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if ( role !== 'admin') {
    return <Navigate to="/admin/login" replace />; // redirect to login
  }

  return children;
};

export default ProtectedAdminRoute;
