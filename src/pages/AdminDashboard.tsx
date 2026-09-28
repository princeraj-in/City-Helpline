import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AdminConsole } from '../components/admin/AdminConsole';

interface AdminDashboardProps {
  onSwitchToStudentView?: () => void;
}

export default function AdminDashboard({ onSwitchToStudentView }: AdminDashboardProps) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminConsole 
      onSwitchToStudentView={() => {
        if (onSwitchToStudentView) {
          onSwitchToStudentView();
        } else {
          localStorage.setItem('admin_view_mode', 'student');
          window.location.href = '/';
        }
      }} 
    />
  );
}
