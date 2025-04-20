import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/logo';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, appName } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const success = login(username, password);
      
      if (success) {
        toast.success('Login successful');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute animate-pulse transform-gpu dark:opacity-20 opacity-40 blur-3xl top-[20%] left-[10%] w-[30%] h-[35%] rounded-full bg-primary/30"></div>
        <div className="absolute animate-pulse duration-[5s] transform-gpu dark:opacity-20 opacity-40 blur-3xl top-[40%] left-[60%] w-[25%] h-[30%] rounded-full bg-blue-300"></div>
        <div className="absolute animate-pulse duration-[7s] transform-gpu dark:opacity-20 opacity-40 blur-3xl top-[70%] left-[30%] w-[20%] h-[25%] rounded-full bg-green-200"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="mb-6 text-center">
          <button 
            onClick={() => navigate('/landing')} 
            className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 animate-scale-in hover:bg-primary/20 transition-colors"
          >
            <Logo size="lg" />
          </button>
          <h1 className="text-4xl font-bold text-gradient mb-2 animate-fade-in">{appName}</h1>
          <p className="text-muted-foreground animate-fade-in animate-delay-100">Employee attendance tracking made simple</p>
        </div>
        
        <Card className="border border-slate-200 dark:border-slate-700/50 shadow-lg animate-scale-in overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12" 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? 
                      <EyeOffIcon className="h-5 w-5" /> : 
                      <EyeIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 mt-6 text-base font-medium transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;