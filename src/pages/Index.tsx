
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
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
        
        <div className="space-x-2">
          <Button variant="ghost" className="text-gray-600">About</Button>
          <Button variant="ghost" className="text-gray-600">Contact</Button>
          <Button variant="outline" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8">
        <div className="md:w-1/2 max-w-lg text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-in">
            Clinical Rotation Management System
          </h1>
          <p className="text-lg text-gray-600 mb-6 animate-slide-in">
            An efficient way to manage student clinical rotations, attendance, and assessments 
            for nursing schools and hospitals.
          </p>
          <Button asChild size="lg" className="animate-slide-in">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
        
        <div className="md:w-1/2 max-w-md w-full">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
