
import React, { useState } from 'react';
import { Profile, UserRole } from '../types';
import { COLORS } from '../constants';

interface ProfileEditViewProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-full bg-white overflow-y-auto pb-20 p-8">
      <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter italic">Profil einrichten</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <img 
              src={formData.photo} 
              className="w-full h-full object-cover rounded-full border-4 border-gray-100 shadow-sm"
              alt="Profile"
            />
            <label className="absolute bottom-0 right-0 bg-[#7B4AE2] text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <input type="file" className="hidden" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vollständiger Name</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-white text-black border-2 border-gray-100 rounded-[20px] focus:ring-4 focus:ring-purple-100 focus:border-[#7B4AE2] transition-all outline-none font-semibold"
              placeholder="z.B. Maria Müller"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ort / Umkreis</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-white text-black border-2 border-gray-100 rounded-[20px] focus:ring-4 focus:ring-purple-100 focus:border-[#7B4AE2] transition-all outline-none font-semibold"
              placeholder="Berlin, 10km"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Über mich</label>
            <textarea
              required
              rows={4}
              className="w-full p-4 bg-white text-black border-2 border-gray-100 rounded-[20px] focus:ring-4 focus:ring-purple-100 focus:border-[#7B4AE2] transition-all outline-none font-semibold resize-none"
              placeholder="Erzähl uns etwas über dich..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-[#FFA45B] to-[#F26A8D] text-white rounded-full font-black text-xl shadow-xl shadow-pink-200/50 hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-tight"
        >
          Profil Speichern
        </button>
      </form>
    </div>
  );
};

export default ProfileEditView;
