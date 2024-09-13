import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ActiveListContextType {
  activeList: string;
  setActiveList: (id: string) => void;
}

const ActiveListContext = createContext<ActiveListContextType | undefined>(undefined);

export const ActiveListProvider = ({ children }: { children: ReactNode }) => {
  const [activeList, setActiveList] = useState('default');
  return (
    <ActiveListContext.Provider value={{ activeList, setActiveList }}>
      {children}
    </ActiveListContext.Provider>
  );
};

export const useActiveList = () => {
  const context = useContext(ActiveListContext);
  if (!context) {
    throw new Error('useActiveList must be used within an ActiveListProvider');
  }
  return context;
};
