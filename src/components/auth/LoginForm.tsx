
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (err: any) {
      console.error('Login error in form:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Combined loading state
  const loading = isSubmitting || authLoading;
  
  // Demo user suggestions
  const demoUsers = [
    { email: 'student@example.com', password: 'password123', label: 'Student' },
    { email: 'tutor@example.com', password: 'password123', label: 'Tutor' },
    { email: 'nursing@example.com', password: 'password123', label: 'Nursing Head' },
    { email: 'hospital@example.com', password: 'password123', label: 'Hospital Admin' },
    { email: 'principal@example.com', password: 'password123', label: 'Principal' },
  ];
  
  const setDemoUser = (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to access your account</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-center text-gray-600 mb-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-clinical-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-4">
          <p className="text-xs text-center text-gray-500 mb-2">Demo Users (Click to fill)</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {demoUsers.map((user, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setDemoUser(user)}
                className="text-xs"
              >
                {user.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
