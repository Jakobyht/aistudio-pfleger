
import React from 'react';
import { Profile } from '../types';

interface ChatsListViewProps {
  matches: Profile[];
  onSelectChat: (profile: Profile) => void;
}

const ChatsListView: React.FC<ChatsListViewProps> = ({ matches, onSelectChat }) => {
  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[48px] border border-white/40 shadow-2xl overflow-hidden flex flex-col p-6">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Deine Nachrichten</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 pb-12">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <p className="font-medium">Noch keine Matches.</p>
          </div>
        ) : (
          matches.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelectChat(profile)}
              className="w-full flex items-center p-4 rounded-3xl bg-white border border-transparent hover:border-white/50 transition-all active:scale-[0.98] shadow-sm group"
            >
              <img src={profile.photo} className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-gray-50" alt={profile.name} />
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-gray-800">{profile.name}</h4>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Aktiv</span>
                </div>
                <p className="text-sm text-gray-400 truncate">Klicke um den Chat zu öffnen...</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatsListView;
