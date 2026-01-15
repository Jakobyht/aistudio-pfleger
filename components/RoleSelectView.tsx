
import React from 'react';
import { UserRole } from '../types';

interface RoleSelectViewProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelectView: React.FC<RoleSelectViewProps> = ({ onSelect }) => {
  return (
    <div className="h-full flex flex-col justify-center p-8 bg-white/10 backdrop-blur-xl">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic">Willkommen!</h2>
        <p className="text-white/70 font-medium">Wie möchtest du NurseMatch nutzen?</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto w-full">
        <button
          onClick={() => onSelect(UserRole.CAREGIVER)}
          className="w-full p-8 text-center bg-white rounded-[32px] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 group"
        >
           <span className="block text-3xl mb-2">🧑‍⚕️</span>
           <div className="font-black text-2xl text-gray-800 uppercase tracking-tight">Ich biete Pflege</div>
           <p className="text-gray-400 text-sm font-bold mt-1">Hilf anderen Menschen</p>
        </button>

        <button
          onClick={() => onSelect(UserRole.CARESEEKER)}
          className="w-full p-8 text-center bg-white rounded-[32px] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 group"
        >
           <span className="block text-3xl mb-2">🏠</span>
           <div className="font-black text-2xl text-gray-800 uppercase tracking-tight">Ich suche Pflege</div>
           <p className="text-gray-400 text-sm font-bold mt-1">Finde die perfekte Betreuung</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelectView;
