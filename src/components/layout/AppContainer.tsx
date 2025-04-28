import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { BarChart3, Menu, X } from 'lucide-react';

interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({ children }: AppContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md text-primary-600 md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X size={20} className="text-primary-600" />
        ) : (
          <Menu size={20} className="text-primary-600" />
        )}
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-64 transition-all duration-300">
        {/* App header */}
        <header className="flex items-center mb-8">
          <BarChart3 size={28} className="text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-neutral-800">Personal Finance Tracker</h1>
        </header>

        {/* Page content */}
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}