export interface Prediction {
  name: string;
  pred: string[][];
  hash: number;
  model: string;
}

export interface PredictionFirestore {
  name: string;
  date: Date;
  prediction: string;
  imageHash: number;
}

export interface PredictionTable {
  id: string;
  name: string;
  date: Date;
  prediction: string[][];
  imageHash: number;
  imageUrl: string | null;
  model: string;
}
