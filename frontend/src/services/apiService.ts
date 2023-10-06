import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Prediction } from '../models/Prediction';

let apiUrl = '';
if (process.env.REACT_APP_BACKEND_URL) {
  apiUrl = process.env.REACT_APP_BACKEND_URL;
} else {
  apiUrl = 'https://crittersleuthbackend.keshuac.com/';
}

export const getPredictions = (formData: FormData, model: string) => axios.post<Prediction[]>(`${apiUrl}api/v1/upload_json`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  params: {
    model,
  },
});

export const getCSV = (predictions: Prediction[]) => axios.post<string>(`${apiUrl}api/v1/create_csv`, predictions, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getXLSX = (predictions: Prediction[]) => axios.post<string>(`${apiUrl}api/v1/create_xlsx`, predictions, {
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getModels = () => axios.get<string[]>(`${apiUrl}api/v1/available_models`);


export const getImage = (image_name: string, hash: string) => axios.get<string>(`${apiUrl}api/v1/get_image`, {
  params: {
    image_name,
    hash,
  },
  responseType: 'blob'
}) .then((response) => {
  if (response.status === 200) {
    // Successfully received the image
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } else {
    // Handle other status codes if needed
    console.error('Failed to fetch image:', response.status);
    return null; // Return null or throw an error as needed
  }
})
.catch((error) => {
  console.error('Error fetching image:', error);
  throw error; // Handle the error as needed
});;