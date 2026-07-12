import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, UserCircle, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

export function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Check initial preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
          <div className="hidden md:block text-sm text-right">
            <p className="font-medium leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
