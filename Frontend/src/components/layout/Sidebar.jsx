import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  BarChart3,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function Sidebar() {
  const { user, logout } = useAuth();

  // Role-based logic
  const getNavItems = () => {
    const role = user?.role || 'Fleet Manager';
    const allItems = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager'] },
      { name: 'Vehicles', path: '/vehicles', icon: Truck, roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
      { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Fleet Manager', 'Safety Officer'] },
      { name: 'Trips', path: '/trips', icon: Map, roles: ['Fleet Manager', 'Driver'] },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Fleet Manager'] },
      { name: 'Fuel & Expenses', path: '/fuel-expenses', icon: Fuel, roles: ['Fleet Manager', 'Financial Analyst'] },
      { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
    ];
    
    // For Fleet Manager, show everything, otherwise filter by role
    return allItems.filter(item => role === 'Fleet Manager' || item.roles.includes(role));
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <Truck className="mr-2 h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight text-primary">TransitOps</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all mb-1",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium leading-none truncate" title={user?.name}>{user?.name || 'User'}</p>
          <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Role'}</p>
        </div>
        <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
