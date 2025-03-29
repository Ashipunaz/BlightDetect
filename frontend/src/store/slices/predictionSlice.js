import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  predictions: [],
  currentPrediction: null,
  loading: false,
  error: null,
};

const predictionSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    fetchPredictionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPredictionsSuccess: (state, action) => {
      state.loading = false;
      state.predictions = action.payload;
    },
    fetchPredictionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPrediction: (state, action) => {
      state.currentPrediction = action.payload;
    },
    addPrediction: (state, action) => {
      state.predictions.unshift(action.payload);
    },
    deletePrediction: (state, action) => {
      state.predictions = state.predictions.filter(
        (pred) => pred._id !== action.payload
      );
    },
  },
});

export const {
  fetchPredictionsStart,
  fetchPredictionsSuccess,
  fetchPredictionsFailure,
  setCurrentPrediction,
  addPrediction,
  deletePrediction,
} = predictionSlice.actions;

export default predictionSlice.reducer; 