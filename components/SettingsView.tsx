
import React from 'react';
import { Profile } from '../types';

interface SettingsViewProps {
  profile: Profile;
  onEdit: () => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onEdit, onLogout }) => {
  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[48px] border border-white/40 shadow-2xl overflow-y-auto p-8">
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#F26A8D] to-[#D471ED] rounded-full blur opacity-40 animate-pulse"></div>
          <img src={profile.photo} className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl" alt="Profile" />
        </div>
        <h2 className="text-3xl font-bold text-white mt-8 tracking-tight">{profile.name}</h2>
        <div className="mt-3 px-5 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
           <p className="text-white font-bold text-xs uppercase tracking-widest">{profile.role === 'CAREGIVER' ? 'Betreuer' : 'Pflege-Suchender'}</p>
        </div>
      </div>

      <div className="space-y-4 max-w-lg mx-auto">
        <button 
          onClick={onEdit}
          className="w-full flex items-center justify-between p-6 bg-white rounded-3xl hover:bg-white/90 transition-colors shadow-lg active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Profil bearbeiten</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-6 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition-colors shadow-lg active:scale-95 glow-red"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-2xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <span className="font-bold text-lg">Abmelden</span>
          </div>
        </button>
      </div>

      <div className="mt-16 text-center">
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase">NurseMatch v1.0.0 Beta</p>
      </div>
    </div>
  );
};

export default SettingsView;
