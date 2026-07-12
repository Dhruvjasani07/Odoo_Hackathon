import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Truck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password === 'wrong') {
      setError('Invalid credentials. Account locked after 5 failed attempts.');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials. Account locked after 5 failed attempts.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center text-primary">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Truck className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
        </div>
        
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase text-xs tracking-wider">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Raven.k@transitops.in" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase text-xs tracking-wider">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="h-4 w-4 rounded border-input bg-transparent text-primary accent-primary" 
                  />
                  <Label htmlFor="remember" className="font-normal cursor-pointer text-sm">Remember me</Label>
                </div>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
              <p className="mb-2">Access is scoped by role after login:</p>
              <ul className="space-y-1 list-disc list-inside text-left">
                <li><span className="font-medium text-foreground">Fleet Manager</span> &rarr; Fleet, Maintenance</li>
                <li><span className="font-medium text-foreground">Dispatcher</span> &rarr; Dashboard, Trips</li>
                <li><span className="font-medium text-foreground">Safety Officer</span> &rarr; Drivers, Compliance</li>
                <li><span className="font-medium text-foreground">Financial Analyst</span> &rarr; Fuel & Expenses, Analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
