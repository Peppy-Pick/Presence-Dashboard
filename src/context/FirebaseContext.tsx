
import React, { ReactNode, createContext, useContext } from 'react';

// Define a minimal interface for what we're providing
interface FirebaseContextType {
  // Add minimal firebase functionality if needed
  // This is a placeholder for compatibility
}

// Create the context with default values
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Dummy provider that doesn't do anything
export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  // We're just passing down children without any actual Firebase functionality
  return <FirebaseContext.Provider value={{}}>{children}</FirebaseContext.Provider>;
};

// Hook for using the Firebase context
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};
