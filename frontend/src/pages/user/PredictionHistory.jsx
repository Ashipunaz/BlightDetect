import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { predictionAPI } from '../../services/api';
import {
  fetchPredictionsStart,
  fetchPredictionsSuccess,
  fetchPredictionsFailure,
  deletePrediction,
} from '../../store/slices/predictionSlice';
import toast from 'react-hot-toast';

const PredictionHistory = () => {
  const dispatch = useDispatch();
  const { predictions, loading } = useSelector((state) => state.predictions);
  const [filteredPredictions, setFilteredPredictions] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    setFilteredPredictions(predictions);
  }, [predictions]);

  const fetchPredictions = async () => {
    dispatch(fetchPredictionsStart());
    try {
      const response = await predictionAPI.getPredictions();
      dispatch(fetchPredictionsSuccess(response.data));
    } catch (error) {
      dispatch(fetchPredictionsFailure(error.response?.data?.message || 'Failed to fetch predictions'));
      toast.error('Failed to fetch prediction history');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      await predictionAPI.deletePrediction(id);
      dispatch(deletePrediction(id));
      toast.success('Prediction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete prediction');
    }
  };

  const handleFilter = (disease) => {
    if (disease === 'all') {
      setFilteredPredictions(predictions);
    } else {
      setFilteredPredictions(
        predictions.filter((pred) => pred.disease.toLowerCase() === disease.toLowerCase())
      );
    }
  };

  const getDiseaseColor = (disease) => {
    switch (disease?.toLowerCase()) {
      case 'early blight':
        return 'bg-orange-100 text-orange-800';
      case 'late blight':
        return 'bg-red-100 text-red-800';
      case 'healthy':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prediction History</h1>
        <p className="mt-2 text-gray-600">
          View and manage your previous predictions
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter('all')}
          className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          All
        </button>
        <button
          onClick={() => handleFilter('healthy')}
          className="px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
        >
          Healthy
        </button>
        <button
          onClick={() => handleFilter('early blight')}
          className="px-4 py-2 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          Early Blight
        </button>
        <button
          onClick={() => handleFilter('late blight')}
          className="px-4 py-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
        >
          Late Blight
        </button>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No predictions found</p>
          </div>
        ) : (
          filteredPredictions.map((prediction) => (
            <div key={prediction._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getDiseaseColor(
                        prediction.disease
                      )}`}
                    >
                      {prediction.disease}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(prediction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-gray-900">Recommendation:</h3>
                    <p className="mt-1 text-gray-600">{prediction.recommendation}</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-gray-900">Confidence:</h3>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {(prediction.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleDelete(prediction._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionHistory; 