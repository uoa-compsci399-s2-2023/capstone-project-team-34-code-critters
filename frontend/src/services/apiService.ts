import axios from 'axios';
import { Prediction } from '../models/Prediction';

const apiEndpoint = process.env.API_URL!;

export const getPredictions = (formData: FormData) => axios.post<Prediction[]>('http://127.0.0.1:5000/api/utilities_api/upload_json', formData, {
  headers: {

    'Content-Type': 'multipart/form-data',
  },
});
