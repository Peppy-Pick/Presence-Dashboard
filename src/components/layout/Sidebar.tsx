
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setCurrentPage, appName, logout } = useAppContext();
  
  const menuItems = [
    { icon: BarChart3, text: 'Dashboard', path: '/' },
    { icon: Users, text: 'Employees', path: '/employees' },
    { icon: Calendar, text: 'Attendance', path: '/attendance' },
    { icon: Settings, text: 'Settings', path: '/settings' },
  ];
  
  // Set current page based on location
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('dashboard');
    } else {
      const page = path.split('/')[1];
      setCurrentPage(page);
    }
  }, [location, setCurrentPage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 bottom-0 z-10 glass border-r border-slate-200 dark:border-slate-700/50 w-64 pt-0 md:translate-x-0 transition-all duration-300 ease-in-out",
        !sidebarOpen && "translate-x-[-100%]",
        sidebarOpen && "translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center">
            {/* App name removed as requested */}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = 
                  (item.path === '/' && location.pathname === '/') || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <li key={item.text}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary text-foreground hover:text-foreground"
                      )}
                      onClick={() => window.innerWidth < 768 && sidebarOpen && document.body.click()} // Close sidebar on mobile after click
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
