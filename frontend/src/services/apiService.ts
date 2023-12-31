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

export const getImage = (image_name: string, hash: number) => axios.get<Blob>(`${apiUrl}api/v1/get_image`, {
  params: {
    image_name,
    hash,
  },
  responseType: 'blob',
});

export const getInsectInfo = (insectName: string) => axios.post<any>(`${apiUrl}api/v1/get_insect_info?name=${insectName}`, {
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getInsectCount = (genusKey: string) => axios.post<any>(`${apiUrl}api/v1/get_insect_occurances_count?genusKey=${genusKey}`);
