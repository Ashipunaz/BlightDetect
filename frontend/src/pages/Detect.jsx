import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Detect = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { token } = useAuth();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      // Mock detection result for now
      const detectionResult = {
        disease: 'Late Blight',
        confidence: 92.00,
        recommendations: 'Apply fungicide treatment, remove infected leaves, and ensure proper air circulation.'
      };

      // Save prediction to backend
      await axios.post('/api/predictions', {
        image: selectedImage,
        ...detectionResult
      }, {
        headers: { 'x-auth-token': token }
      });

      setResult(detectionResult);
    } catch (error) {
      console.error('Error during detection:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Detect Plant Disease
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <input
          accept="image/*"
          type="file"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload Image
          </Button>
        </label>

        {selectedImage && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={selectedImage}
              alt="Selected plant"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleDetection}
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Detect Disease'}
            </Button>
          </Box>
        )}
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Detection Results
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {result.disease}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Confidence: {result.confidence.toFixed(2)}%
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Treatment Recommendations:
          </Typography>
          <Typography variant="body1">
            {result.recommendations}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Detect; 