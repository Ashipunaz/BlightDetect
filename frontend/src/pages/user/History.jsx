import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    console.log('History component mounted');
    console.log('Current auth token:', token);
  }, [token]);

  const fetchPredictions = async () => {
    try {
      setError(null);
      console.log('Fetching predictions...');
      const response = await axios.get('/api/predictions');
      console.log('Raw API response:', response);
      console.log('Predictions data:', response.data);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected an array');
      }
      
      setPredictions(response.data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.message || 'Failed to fetch prediction history');
      toast.error('Failed to fetch prediction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      console.log('Deleting prediction:', id);
      await axios.delete(`/api/predictions/${id}`);
      setPredictions(predictions.filter(pred => pred._id !== id));
      toast.success('Prediction deleted successfully');
    } catch (err) {
      console.error('Error deleting prediction:', err);
      toast.error('Failed to delete prediction');
    }
  };

  const downloadImage = (imageUrl, disease) => {
    try {
      console.log('Downloading image:', imageUrl);
      const baseURL = 'http://localhost:5000';
      const fullUrl = `${baseURL}/${imageUrl}`;
      console.log('Full image URL:', fullUrl);
      
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `plant-disease-${disease}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Failed to download image');
    }
  };

  const generateCSV = (data) => {
    const headers = ["Disease", "Confidence", "Recommendations", "Date"];
    const csvRows = [
      headers.join(','),
      data.map(row => 
        [
          `"${row.disease}"`,
          `"${row.confidence}%"`,
          `"${row.recommendations}"`,
          `"${row.date}"`
        ].join(',')
      ).join('\n')
    ];
    return csvRows.join('\n');
  };

  const downloadSingleRecord = (prediction) => {
    try {
      console.log('Downloading single record:', prediction);
      const recordData = [{
        disease: prediction.disease,
        confidence: prediction.confidence,
        recommendations: prediction.recommendations,
        date: new Date(prediction.createdAt).toLocaleDateString()
      }];

      const csvContent = "data:text/csv;charset=utf-8," + generateCSV(recordData);
      
      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.download = `plant-disease-record-${prediction.disease}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Record downloaded successfully');
    } catch (err) {
      console.error('Error downloading record:', err);
      toast.error('Failed to download record');
    }
  };

  const downloadAllHistory = () => {
    try {
      console.log('Downloading all history...');
      const historyData = predictions.map(pred => ({
        disease: pred.disease,
        confidence: pred.confidence,
        recommendations: pred.recommendations,
        date: new Date(pred.createdAt).toLocaleDateString()
      }));

      const csvContent = "data:text/csv;charset=utf-8," + generateCSV(historyData);

      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.download = `disease-detection-history-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('All history downloaded successfully');
    } catch (err) {
      console.error('Error downloading history:', err);
      toast.error('Failed to download history');
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={fetchPredictions}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detection History</h2>
        {predictions.length > 0 && (
          <button
            onClick={downloadAllHistory}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download All History
          </button>
        )}
      </div>

      {predictions.length === 0 ? (
        <div className="text-center text-gray-600 bg-white rounded-lg shadow p-8">
          <p className="text-lg">No detection history available</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {predictions.map((prediction) => (
            <div key={prediction._id} className="bg-white rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`http://localhost:5000/${prediction.image}`}
                    alt="Plant"
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.error('Image failed to load:', prediction.image);
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => downloadImage(prediction.image, prediction.disease)}
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={() => downloadSingleRecord(prediction)}
                      className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
                    >
                      Download Record
                    </button>
                    <button
                      onClick={() => handleDelete(prediction._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">{prediction.disease}</h3>
                  <p className="text-gray-600 mb-2">
                    Confidence: {prediction.confidence}%
                  </p>
                  <p className="text-gray-600 mb-4">
                    Date: {new Date(prediction.createdAt).toLocaleDateString()}
                  </p>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <p className="text-gray-600">{prediction.recommendations}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 