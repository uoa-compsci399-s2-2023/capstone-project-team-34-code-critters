import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Prediction } from '../models/Prediction';

let apiUrl = '';
if (process.env.REACT_APP_API_URL) {
  apiUrl = process.env.REACT_APP_API_URL;
} else {
  apiUrl = "http://code-critters.onrender.com/";
}

export const getPredictions = (formData: FormData) => axios.post<Prediction[]>(apiUrl + 'api/utilities_api/upload_json', formData, {
  headers: {

    'Content-Type': 'multipart/form-data',
  },
});
