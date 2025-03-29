import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('/api/predictions', {
          headers: { 'x-auth-token': token }
        });
        setPredictions(response.data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Detection History
      </Typography>
      <Grid container spacing={3}>
        {predictions.map((prediction) => (
          <Grid item xs={12} sm={6} md={4} key={prediction._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={prediction.image}
                alt="Plant Image"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {prediction.disease}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Confidence: {prediction.confidence.toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(prediction.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recommendations:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prediction.recommendations}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {predictions.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No detection history found. Try detecting some plant diseases first!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default History; 