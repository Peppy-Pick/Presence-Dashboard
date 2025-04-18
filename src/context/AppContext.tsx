
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ThemeType = 'light' | 'dark';

interface OfficeLocation {
  latitude: number;
  longitude: number;
  radius: number;
}

type AppContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  appName: string;
  username: string;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  theme: ThemeType;
  toggleTheme: () => void;
  officeLocation: OfficeLocation | null;
  updateOfficeLocation: (location: OfficeLocation) => void;
  googleMapsApiKey: string;
  setGoogleMapsApiKey: (key: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Unicrore');
  const [theme, setTheme] = useState<ThemeType>('light');
  const [officeLocation, setOfficeLocation] = useState<OfficeLocation | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  const appName = 'Presence';

  // Load authentication state from localStorage on component mount
  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      try {
        const { isLoggedIn: storedIsLoggedIn, username: storedUsername } = JSON.parse(storedAuthState);
        setIsLoggedIn(storedIsLoggedIn);
        setUsername(storedUsername || 'Unicrore');
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
        // Clear invalid storage data
        localStorage.removeItem('authState');
      }
    }
    
    // Load theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }
    
    // Load office location
    const storedLocation = localStorage.getItem('officeLocation');
    if (storedLocation) {
      try {
        setOfficeLocation(JSON.parse(storedLocation));
      } catch (error) {
        console.error('Error parsing stored location:', error);
      }
    }
  }, []);

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const updateOfficeLocation = (location: OfficeLocation) => {
    setOfficeLocation(location);
    localStorage.setItem('officeLocation', JSON.stringify(location));
  };

  const login = (username: string, password: string): boolean => {
    // Simple authentication logic
    if (username === 'unicrore_admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername('Unicrore');
      
      // Store authentication state in localStorage
      localStorage.setItem('authState', JSON.stringify({
        isLoggedIn: true,
        username: 'Unicrore'
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Clear authentication state from localStorage
    localStorage.removeItem('authState');
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentPage,
        setCurrentPage,
        appName,
        username,
        isLoggedIn,
        login,
        logout,
        theme,
        toggleTheme,
        officeLocation,
        updateOfficeLocation,
        googleMapsApiKey,
        setGoogleMapsApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
