import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { FirebaseProvider } from "@/context/FirebaseContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import EmployeeDetail from "@/pages/EmployeeDetail";
import Attendance from "@/pages/Attendance";
import AttendanceDetail from "@/pages/AttendanceDetail";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { fetchAppConfig, ConfigData, ApiResponse } from "@/lib/apiClient";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

// Fetch app configurations including Google Maps API key
const AppConfigLoader = ({ children }: { children: React.ReactNode }) => {
  const { setGoogleMapsApiKey, isLoggedIn, updateOfficeLocation } = useAppContext();
  const [configLoaded, setConfigLoaded] = useState(false);
  
  useEffect(() => {
    const loadAppConfig = async () => {
      // Don't fetch if we already loaded the config in this session
      if (configLoaded) return;
      
      console.log('AppConfigLoader: Starting app config loading sequence');
      
      try {
        // First try to quickly load from localStorage for faster app startup
        const storedKey = localStorage.getItem('googleMapsApiKey');
        if (storedKey) {
          console.log('AppConfigLoader: Using Google Maps API key from localStorage');
          setGoogleMapsApiKey(storedKey);
        }
        
        // Only fetch from API if logged in
        if (isLoggedIn) {
          // Then try to fetch fresh from the API endpoint
          console.log('AppConfigLoader: Fetching fresh config data from API');
          const response: ApiResponse<ConfigData> = await fetchAppConfig();
          
          if (response.data) {
            console.log('AppConfigLoader: Processing received config data', response.data);
            
            if (response.data.googleMapsApiKey) {
              console.log('AppConfigLoader: Updating Google Maps API key from API');
              setGoogleMapsApiKey(response.data.googleMapsApiKey);
              localStorage.setItem('googleMapsApiKey', response.data.googleMapsApiKey);
            }
            
            // Also update office location if available
            if (response.data.office_location) {
              console.log('AppConfigLoader: Updating office location from API');
              const location = {
                latitude: response.data.office_location.latitude,
                longitude: response.data.office_location.longitude,
                radius: response.data.allowed_radius_km ? response.data.allowed_radius_km * 1000 : 100 // Convert km to meters
              };
              updateOfficeLocation(location);
            }
            
            setConfigLoaded(true);
          }
        }
      } catch (error) {
        console.error('AppConfigLoader: Error loading app config:', error);
      }
    };

    // Load config immediately
    loadAppConfig();
  }, [isLoggedIn, setGoogleMapsApiKey, updateOfficeLocation, configLoaded, setConfigLoaded]);

  // Re-fetch when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      setConfigLoaded(false); // Reset so we fetch again after login
    }
  }, [isLoggedIn]);

  return <>{children}</>;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Main layout component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="pt-16 md:pl-64 transition-all duration-300 min-h-screen">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
};

// Home route with redirect based on auth status
const HomeRoute = () => {
  const { isLoggedIn } = useAppContext();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }
  
  // Now redirecting to login page instead of landing page
  return <Navigate to="/login" />;
};

const AppWithProvider = () => {
  const { isLoggedIn } = useAppContext();
  
  return (
    <AppConfigLoader>
      <Provider store={store}>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/" element={<HomeRoute />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Employees />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EmployeeDetail />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Attendance />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance/:date" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AttendanceDetail />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </AppConfigLoader>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FirebaseProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppWithProvider />
          </BrowserRouter>
        </AppProvider>
      </FirebaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
