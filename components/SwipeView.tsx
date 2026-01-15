
import React, { useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { COLORS } from '../constants';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

interface SwipeViewProps {
  userRole: UserRole;
  onMatch: (profile: Profile) => void;
  onOpenChat: (profile: Profile) => void;
  onToggleNav: () => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ userRole, onMatch, onOpenChat, onToggleNav }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchOverlay, setShowMatchOverlay] = useState<Profile | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      
      const targetRole = userRole === UserRole.CAREGIVER ? UserRole.CARESEEKER : UserRole.CAREGIVER;
      const q = query(collection(db, "profiles"), where("role", "==", targetRole));
      
      try {
        const querySnapshot = await getDocs(q);
        const fetchedProfiles: Profile[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== auth.currentUser?.uid) {
            fetchedProfiles.push({ id: doc.id, ...doc.data() } as Profile);
          }
        });
        setProfiles(fetchedProfiles);
      } catch (e) {
        console.error("Error fetching profiles:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userRole]);

  const handleSwipe = async (liked: boolean) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile || !auth.currentUser) return;

    setIsFlipped(false);

    if (liked) {
      const myUid = auth.currentUser.uid;
      const theirUid = currentProfile.id;

      // 1. Save my like for them
      await setDoc(doc(db, `profiles/${myUid}/likes`, theirUid), {
        liked: true,
        timestamp: Date.now()
      });

      // 2. Check if they liked me back
      const crossLikeDoc = await getDoc(doc(db, `profiles/${theirUid}/likes`, myUid));
      
      if (crossLikeDoc.exists()) {
        // IT'S A MATCH!
        const matchData = {
          users: [myUid, theirUid],
          timestamp: Date.now()
        };
        await setDoc(doc(db, "matches", `${myUid}_${theirUid}`), matchData);
        setShowMatchOverlay(currentProfile);
        onMatch(currentProfile);
      }
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <p className="mt-4 font-bold">Suche Profile...</p>
    </div>
  );

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="text-6xl mb-6">🏜️</div>
      <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Gähnende Leere</h2>
      <p className="text-white/70 max-w-[240px]">
        Es sind aktuell keine anderen {userRole === UserRole.CAREGIVER ? 'Suchenden' : 'Pfleger'} in deiner Nähe registriert.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-8 px-10 py-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 font-bold hover:bg-white/30 transition-all"
      >
        Erneut suchen
      </button>
    </div>
  );

  return (
    <div className="flex-1 px-4 pb-6 flex flex-col overflow-hidden max-w-xl mx-auto w-full">
      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[48px] border border-white/40 shadow-2xl overflow-hidden flex flex-col">
        
        <div className="relative flex-1 p-4 perspective cursor-pointer" onClick={toggleFlip}>
          <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            
            <div className="flip-card-front">
              <div className="w-full h-full rounded-[38px] overflow-hidden relative shadow-inner bg-gray-200">
                <img 
                  src={currentProfile.photo || 'https://picsum.photos/seed/placeholder/600/800'} 
                  className="w-full h-full object-cover"
                  alt={currentProfile.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-0 right-0 px-8 text-center text-white">
                  <h3 className="text-4xl font-bold mb-1 tracking-tight">{currentProfile.name}</h3>
                  
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="glow-star" width="18" height="18" viewBox="0 0 24 24" fill={i < currentProfile.rating ? COLORS.GOLD : 'none'} stroke={COLORS.GOLD} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-base font-semibold text-white/90">
                    {currentProfile.location || 'In deiner Nähe'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card-back bg-white rounded-[38px] p-8 flex flex-col shadow-inner">
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Über {currentProfile.name}</h3>
               <p className="text-gray-600 leading-relaxed flex-1 overflow-y-auto">
                 {currentProfile.bio || 'Keine Beschreibung vorhanden.'}
               </p>
               <div className="mt-4">
                  <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Interessen & Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.tags && currentProfile.tags.length > 0 ? currentProfile.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">#{tag}</span>
                    )) : <span className="text-gray-300 italic text-xs">Keine Tags</span>}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 flex items-center justify-between gap-3 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe(false); }}
            className="w-14 h-14 bg-white flex items-center justify-center rounded-full glow-red shadow-lg hover:scale-110 active:scale-90 transition-transform flex-shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5A5F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); toggleFlip(); }}
            className="flex-1 py-3 px-4 bg-[#FFA45B] text-white rounded-full font-bold text-base shadow-lg glow-orange flex items-center justify-center gap-2 hover:bg-[#ffb473] active:scale-95 transition-all"
          >
            Details <span className={`text-lg transition-transform ${isFlipped ? 'rotate-180' : ''}`}>↑</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe(true); }}
            className="w-14 h-14 bg-[#4CD964] flex items-center justify-center rounded-full glow-green shadow-lg hover:scale-110 active:scale-90 transition-transform flex-shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
      </div>

      {showMatchOverlay && (
        <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-8 text-center animate-in zoom-in duration-300">
          <div className="relative mb-12">
             <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
             <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
                <img src={showMatchOverlay.photo} className="w-full h-full object-cover" alt="Match" />
             </div>
          </div>
          <h2 className="text-6xl font-black text-white mb-2 italic tracking-tighter">Matched!</h2>
          <p className="text-white/80 text-lg mb-12 max-w-[280px]">Du und {showMatchOverlay.name} passen perfekt zusammen.</p>
          <div className="w-full space-y-4 max-w-sm">
            <button 
              onClick={() => {
                setShowMatchOverlay(null);
                onOpenChat(showMatchOverlay);
              }}
              className="w-full py-4 bg-white text-[#F26A8D] rounded-full font-bold text-xl shadow-xl active:scale-95 transition-transform"
            >
              Chat starten
            </button>
            <button 
              onClick={() => setShowMatchOverlay(null)}
              className="w-full py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5"
            >
              Vielleicht später
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeView;
