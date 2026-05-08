import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface GlobalLockContextType {
  isLocked: boolean;
  lock: (duration?: number) => void;
  unlock: () => void;
  safeAction: <T extends (...args: any[]) => any>(fn: T, duration?: number) => (...args: Parameters<T>) => void;
}

const GlobalLockContext = createContext<GlobalLockContextType | undefined>(undefined);

export const GlobalLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const lockTimer = useRef<NodeJS.Timeout | null>(null);

  const unlock = useCallback(() => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    setIsLocked(false);
  }, []);

  const lock = useCallback((duration = 500) => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    setIsLocked(true);
    lockTimer.current = setTimeout(() => {
      setIsLocked(false);
    }, duration);
  }, []);

  const safeAction = useCallback(<T extends (...args: any[]) => any>(fn: T, duration = 500) => {
    return (...args: Parameters<T>) => {
      if (isLocked) return;
      lock(duration);
      fn(...args);
    };
  }, [isLocked, lock]);

  return (
    <GlobalLockContext.Provider value={{ isLocked, lock, unlock, safeAction }}>
      {children}
    </GlobalLockContext.Provider>
  );
};

export const useGlobalLock = () => {
  const context = useContext(GlobalLockContext);
  if (context === undefined) {
    throw new Error('useGlobalLock must be used within a GlobalLockProvider');
  }
  return context;
};
