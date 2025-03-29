import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Get the API URL from Vite's environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchPredictions();
  }, [user, navigate]);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('/api/admin/predictions');
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in again');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch predictions');
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';
    // If the image path is a full URL, use it as is
    if (imagePath.startsWith('http')) return imagePath;
    // The backend stores paths like 'uploads/filename.jpg'
    return `${API_URL}/${imagePath}`;
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = '/placeholder-image.png';
    toast.error('Failed to load image. Please try again later.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!predictions.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Predictions</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No predictions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Predictions</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disease
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction) => (
                <tr key={prediction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.user?.name || 'Deleted User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prediction.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prediction.disease || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prediction.confidence || 0}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {prediction.createdAt ? new Date(prediction.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedPrediction(prediction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prediction Details Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">Prediction Details</h2>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPrediction.user?.name || 'Deleted User'} ({selectedPrediction.user?.email || 'N/A'})
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Disease</label>
                <div className="mt-1 text-sm text-gray-900">{selectedPrediction.disease || 'Unknown'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confidence</label>
                <div className="mt-1 text-sm text-gray-900">{selectedPrediction.confidence || 0}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPrediction.createdAt ? new Date(selectedPrediction.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recommendations</label>
                <div className="mt-1 text-sm text-gray-900">{selectedPrediction.recommendations || 'No recommendations available'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-2">
                  <img
                    src={getImageUrl(selectedPrediction.image)}
                    alt="Plant"
                    className="max-w-full h-auto rounded-lg"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 