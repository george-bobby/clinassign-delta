
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AttendancePage from "./pages/AttendancePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import ChatPage from "./pages/ChatPage";
import ManageSchedulePage from "./pages/ManageSchedulePage";
import ReviewCasesPage from "./pages/ReviewCasesPage";
import StudentsPage from "./pages/StudentsPage";
import TutorsPage from "./pages/TutorsPage";
import SchedulePage from "./pages/SchedulePage";
import CaseStudiesPage from './pages/CaseStudiesPage';
import Chatbot from './pages/Chatbot';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/manage-schedule" element={<ManageSchedulePage />} />
            <Route path="/review-cases" element={<ReviewCasesPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/tutors" element={<TutorsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/chatbot" element={<Chatbot />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
