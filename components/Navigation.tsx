
import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, onClose }) => {
  const items: { label: string; view: AppView; icon: string }[] = [
    { label: 'Entdecken', view: 'SWIPE', icon: '🔥' },
    { label: 'Meine Chats', view: 'CHATS', icon: '💬' },
    { label: 'Mein Profil', view: 'SETTINGS', icon: '👤' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl flex flex-col gap-4 border border-white/50">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-400 text-sm uppercase tracking-widest">Navigation</span>
        <button onClick={onClose} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      {items.map(item => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`w-full py-5 px-8 rounded-3xl flex items-center justify-between transition-all active:scale-[0.98] ${
            currentView === item.view 
              ? 'bg-gradient-to-r from-[#F26A8D] to-[#D471ED] text-white shadow-xl shadow-pink-200/50' 
              : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-5">
            <span className="text-2xl">{item.icon}</span>
            <span className="font-bold text-xl">{item.label}</span>
          </div>
          {currentView === item.view && (
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm animate-pulse"></div>
          )}
        </button>
      ))}

      <div className="mt-4 pt-6 text-center">
        <p className="text-xs text-gray-400 font-medium">CareMatch v1.0 • Built with Heart</p>
      </div>
    </div>
  );
};

export default Navigation;
