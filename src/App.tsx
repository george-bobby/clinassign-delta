
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import AttendancePage from '@/pages/AttendancePage';
import ChatPage from '@/pages/ChatPage';
import SchedulePage from '@/pages/SchedulePage';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
