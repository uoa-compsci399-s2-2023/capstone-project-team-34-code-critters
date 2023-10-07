export interface Prediction {
  name: string;
  pred: string[][];
  hash: number;
}

export interface PredictionFirestore {
  name: string;
  date: Date;
  prediction: string;
  imageHash: string;
}

export interface PredictionTable {
  name: string;
  date: Date;
  prediction: string[][];
  imageHash: string;
  imageUrl: string | null;
  model: string |null;
}
