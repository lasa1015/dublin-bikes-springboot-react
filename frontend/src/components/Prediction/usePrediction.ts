// src/hooks/usePrediction.ts
import { useEffect, useState } from 'react';
import { CurrentStation } from '../contexts/StationContext';

export interface PredictionResult {
  number: number;
  availableBikes: number;
  availableStands: number;
  forecastTime: string;
}

export default function usePrediction(station: CurrentStation | null) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  useEffect(() => {
    if (!station) return;

    fetch(`/api/predictions/station/${station.number}`)
      .then(res => res.json())
      .then(data => setPredictions(data))
      .catch(err => {
        console.error('获取预测数据失败:', err);
        setPredictions([]);
      });
  }, [station]);

  return predictions;
}
