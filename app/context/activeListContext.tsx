import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { saveActiveList, loadActiveList } from '../utils/activeListUtils';

interface ActiveListContextType {
  activeList: string;
  setActiveList: (id: string) => void;
}

const ActiveListContext = createContext<ActiveListContextType | undefined>(undefined);

export const ActiveListProvider = ({ children }: { children: ReactNode }) => {
  const [activeList, setActiveListState] = useState('default');

  useEffect(() => {
    const fetchActiveList = async () => {
      const savedActiveList = await loadActiveList();
      if (savedActiveList) {
        setActiveListState(savedActiveList);
      }
    };
    fetchActiveList();
  }, []);

  const setActiveList = (id: string) => {
    setActiveListState(id);
    saveActiveList(id);
  };

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
