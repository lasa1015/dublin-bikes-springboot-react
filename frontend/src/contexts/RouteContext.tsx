import { createContext, useContext, useState, ReactNode } from 'react';

interface RouteContextType {
  departureNumber : number | null;
  arrivalNumber   : number | null;

  /** 每点一次 GO 就 +1，用来通知地图重新规划路线 */
  routeTrigger    : number;

  /** DirectionsService 得到的结果 */
  routeResult     : google.maps.DirectionsResult | null;

  /* setters */
  setDepartureNumber: (num: number) => void;
  setArrivalNumber  : (num: number) => void;
  fireRoute         : () => void;
  setRouteResult    : (res: google.maps.DirectionsResult | null) => void;
}

export const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [departureNumber, _setDepartureNumber] = useState<number | null>(null);
  const [arrivalNumber  , _setArrivalNumber  ] = useState<number | null>(null);

  const [routeTrigger , setRouteTrigger ] = useState(0);
  const [routeResult  , setRouteResult  ] = useState<google.maps.DirectionsResult | null>(null);

  /* —— 关键：任何一次变更都先清掉旧路线 —— */
  const setDepartureNumber = (num: number) => {
    _setDepartureNumber(num);
    setRouteResult(null);
  };

  const setArrivalNumber = (num: number) => {
    _setArrivalNumber(num);
    setRouteResult(null);
  };

  /* GO 按钮调用，简单地自增触发值 */
  const fireRoute = () => setRouteTrigger(prev => prev + 1);

  return (
    <RouteContext.Provider
      value={{
        departureNumber,
        arrivalNumber,
        routeTrigger,
        routeResult,
        setDepartureNumber,
        setArrivalNumber,
        fireRoute,
        setRouteResult,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error('useRoute must be used within RouteProvider');
  return ctx;
}
