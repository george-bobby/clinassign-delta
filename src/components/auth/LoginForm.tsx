
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg animate-slide-in">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 rounded-full bg-clinical-600 w-12 h-12 flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to ClinAssign</h2>
        <p className="text-sm text-gray-600 mt-1">Login to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="transition-custom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="transition-custom pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-sm text-clinical-600 hover:text-clinical-700">
              Forgot password?
            </a>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-clinical-600 hover:bg-clinical-700 transition-custom"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Demo credentials for testing:
        </p>
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-500">
          <div>Student: student@example.com / password</div>
          <div>Tutor: tutor@example.com / password</div>
          <div>Nursing Head: nursing@example.com / password</div>
          <div>Hospital Admin: hospital@example.com / password</div>
          <div>Principal: principal@example.com / password</div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
