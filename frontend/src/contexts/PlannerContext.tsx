// src/contexts/PlannerContext.tsx
import { createContext, useContext, useState } from 'react';

type PlannerCtx = {
  departure : string;
  arrival   : string;
  setDeparture: (v: string) => void;
  setArrival  : (v: string) => void;
  planFlag    : number;          // 每次点击 GO 自增 → 触发重新规划
  triggerPlan : () => void;
};

const Ctx = createContext<PlannerCtx | null>(null);
export const usePlanner = () => useContext(Ctx)!;

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [departure, setDeparture] = useState('');
  const [arrival,   setArrival]   = useState('');
  const [planFlag,  setFlag]      = useState(0);

  const triggerPlan = () => setFlag(f => f + 1);

  return (
    <Ctx.Provider value={{
      departure, arrival, setDeparture, setArrival, planFlag, triggerPlan
    }}>
      {children}
    </Ctx.Provider>
  );
}
