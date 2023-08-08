import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Prediction } from '../models/Prediction';

export const getPredictions = (formData: FormData) => axios.post<Prediction[]>('https://code-critters.onrender.com/api/utilities_api/upload_json', formData, {
  headers: {

    'Content-Type': 'multipart/form-data',
  },
});
