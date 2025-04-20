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
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";
import { useEffect, useState } from "react";
import { fetchAppConfig, ConfigData, ApiResponse } from "@/lib/apiClient";

const queryClient = new QueryClient();

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
  
  return <Navigate to="/landing" />;
};

const AppWithProvider = () => {
  const { isLoggedIn } = useAppContext();
  
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />} />
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