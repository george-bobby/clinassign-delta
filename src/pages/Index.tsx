
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  
  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-clinical-50 to-white flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-clinical-600 w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold text-xl text-gray-900">ClinAssign</span>
        </div>
        
        <div>
          <Button variant="ghost" className="text-gray-600">About</Button>
          <Button variant="ghost" className="text-gray-600">Contact</Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <LoginForm />
      </main>
    </div>
  );
};

export default Index;
