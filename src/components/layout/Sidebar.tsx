import React from 'react';
import { Home, PieChart, List, PlusCircle, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarItems = [
    { icon: <Home size={20} />, text: 'Dashboard', isActive: true },
    { icon: <List size={20} />, text: 'Transactions' },
    { icon: <PieChart size={20} />, text: 'Reports' },
    { icon: <PlusCircle size={20} />, text: 'Add Expense' },
    { icon: <Settings size={20} />, text: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out transform w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-start h-16 px-6 border-b">
          <div className="flex items-center">
            <PieChart size={24} className="text-primary-600 mr-3" />
            <span className="font-bold text-lg text-neutral-800">FinTrack</span>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center px-4 py-3 text-base rounded-lg transition-all hover:bg-primary-50 
                  ${item.isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-600'}`}
                >
                  <span className={`mr-3 ${item.isActive ? 'text-primary-600' : 'text-neutral-500'}`}>
                    {item.icon}
                  </span>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}