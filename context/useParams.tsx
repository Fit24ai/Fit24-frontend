"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface ParamsContextType {
  params: any;
  setParams: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ParamsContext = createContext<ParamsContextType | undefined>(undefined);

export const ParamsProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState<any>(undefined);

  useEffect(()=>{
    console.log("paramsiiiii", params)
  }, [params])

  return (
    <ParamsContext.Provider value={{ params, setParams }}>
      {children}
    </ParamsContext.Provider>
  );
};

export const useParams = () => {
  const context = useContext(ParamsContext);
  if (!context) {
    throw new Error('useParams must be used within a ParamsProvider');
  }
  return context;
};
