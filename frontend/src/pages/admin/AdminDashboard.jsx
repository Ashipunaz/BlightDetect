import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    diseaseStats: {
      healthy: 0,
      earlyBlight: 0,
      lateBlight: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getAllPredictions();
      const predictions = response.data;
      
      // Calculate statistics
      const totalUsers = new Set(predictions.map(p => p.user._id)).size;
      const diseaseStats = predictions.reduce((acc, pred) => {
        acc[pred.disease.toLowerCase().replace(' ', '')]++;
        return acc;
      }, { healthy: 0, earlyblight: 0, lateblight: 0 });

      setStats({
        totalUsers,
        totalPredictions: predictions.length,
        diseaseStats,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of system statistics and management options
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>

        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-900">Total Predictions</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalPredictions}</p>
        </div>

        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-900">Healthy Plants</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.diseaseStats.healthy}</p>
        </div>

        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-900">Diseased Plants</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.diseaseStats.earlyblight + stats.diseaseStats.lateblight}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">
            View and manage user accounts, including account status and permissions.
          </p>
          <a
            href="/admin/users"
            className="btn-primary inline-block"
          >
            Manage Users
          </a>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Management</h2>
          <p className="text-gray-600 mb-4">
            View all predictions, filter by disease type, and manage prediction data.
          </p>
          <a
            href="/admin/predictions"
            className="btn-primary inline-block"
          >
            Manage Predictions
          </a>
        </div>
      </div>

      {/* Disease Distribution Chart */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Disease Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Healthy</span>
              <span>{stats.diseaseStats.healthy}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${(stats.diseaseStats.healthy / stats.totalPredictions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Early Blight</span>
              <span>{stats.diseaseStats.earlyblight}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-orange-600 h-2.5 rounded-full"
                style={{
                  width: `${(stats.diseaseStats.earlyblight / stats.totalPredictions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Late Blight</span>
              <span>{stats.diseaseStats.lateblight}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{
                  width: `${(stats.diseaseStats.lateblight / stats.totalPredictions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 