import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';

export default function Dashboard() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (selectedImages.length + files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      if (!file.type.match(/^image\/(jpeg|png|gif)$/i)) {
        toast.error(`${file.name} is not a valid image file (JPG, PNG, or GIF)`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setLoading(true);
    const results = [];

    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post('/api/predictions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        results.push(response.data);
      }

      setPredictions(results);
      toast.success('Disease detection completed!');
      
      // Clear the selected images after successful upload
      setSelectedImages([]);
      previews.forEach(preview => URL.revokeObjectURL(preview));
      setPreviews([]);
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Failed to process images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-6">
          Upload up to 5 photos of your potato plants to detect any potential diseases.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              multiple
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer block w-full"
            >
              <div className="text-center mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 5MB each (max 5 images)
                </p>
              </div>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={selectedImages.length === 0 || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Detect Disease'}
          </button>
        </form>
      </div>

      {predictions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Detection Results
          </h3>
          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h4 className="font-medium text-lg mb-2">Image {index + 1}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Disease:</span>
                    <span className="text-gray-700">{prediction.disease}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Confidence:</span>
                    <span className="text-gray-700">{prediction.confidence}%</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <p className="text-gray-700">{prediction.recommendations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 