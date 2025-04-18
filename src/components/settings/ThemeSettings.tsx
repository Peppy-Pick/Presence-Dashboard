
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { Sun, Moon } from "lucide-react";

const ThemeSettings = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="theme-toggle" className="text-base">Dark Theme</Label>
            {theme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Switch between light and dark themes
          </p>
        </div>
        <Switch
          id="theme-toggle"
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors duration-200" 
          onClick={() => theme === 'dark' && toggleTheme()}>
          <div className="bg-white dark:bg-gray-900 h-32 rounded-lg mb-2 flex items-center justify-center">
            <Sun className="h-8 w-8 text-amber-500" />
          </div>
          <span className="font-medium">Light</span>
        </div>
        
        <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors duration-200"
          onClick={() => theme !== 'dark' && toggleTheme()}>
          <div className="bg-gray-900 dark:bg-black h-32 rounded-lg mb-2 flex items-center justify-center">
            <Moon className="h-8 w-8 text-indigo-400" />
          </div>
          <span className="font-medium">Dark</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
