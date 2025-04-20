import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { useAppContext } from '@/context/AppContext';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { toggleSidebar, appName, username } = useAppContext();
  const [hasNotifications] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-20 glass h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <h2 className="text-lg font-semibold text-primary block">{appName}</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-primary font-medium hidden sm:block">
          Welcome, <span className="font-bold">{username}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-2 px-2 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;