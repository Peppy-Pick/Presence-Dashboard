
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { appName } = useAppContext();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-4 max-w-md p-8 animate-fade-in glass rounded-xl border border-slate-200 dark:border-slate-700/50">
        <FileQuestion className="h-20 w-20 mx-auto text-primary/60" />
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            Return to {appName}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
