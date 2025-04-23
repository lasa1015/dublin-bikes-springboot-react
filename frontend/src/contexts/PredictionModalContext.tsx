// src/contexts/PredictionModalContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { CurrentStation } from './StationContext';

interface PredictionModalContextType {
  selectedStation: CurrentStation | null;
  openModal: (station: CurrentStation) => void;
  closeModal: () => void;
  setSelectedStation: (station: CurrentStation) => void;  //  新增：用于选择其他站
}

const PredictionModalContext = createContext<PredictionModalContextType | undefined>(undefined);

export const PredictionModalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStation, setSelectedStation] = useState<CurrentStation | null>(null);

  const openModal = (station: CurrentStation) => setSelectedStation(station);
  const closeModal = () => setSelectedStation(null);

  return (
    <PredictionModalContext.Provider value={{ selectedStation, openModal, closeModal, setSelectedStation }}>
      {children}
    </PredictionModalContext.Provider>
  );
};

export const usePredictionModal = () => {
  const context = useContext(PredictionModalContext);
  if (!context) {
    throw new Error('usePredictionModal must be used within PredictionModalProvider');
  }
  return context;
};
