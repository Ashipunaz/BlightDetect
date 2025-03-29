import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    console.log('Access denied: User is not an admin');
    return <Navigate to="/login" />;
  }

  return children;
} 