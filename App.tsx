
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { AppView, UserRole, Profile, ChatSession } from './types';
import AuthView from './components/AuthView';
import RoleSelectView from './components/RoleSelectView';
import ProfileEditView from './components/ProfileEditView';
import SwipeView from './components/SwipeView';
import ChatsListView from './components/ChatsListView';
import ChatDetailView from './components/ChatDetailView';
import SettingsView from './components/SettingsView';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('AUTH');
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as Profile);
          setView('SWIPE');
          
          // Listen for matches in real-time
          const matchesQuery = query(collection(db, "matches"), where("users", "array-contains", user.uid));
          onSnapshot(matchesQuery, async (snapshot) => {
            const matchedProfiles: Profile[] = [];
            for (const matchDoc of snapshot.docs) {
              const data = matchDoc.data();
              const otherUserId = data.users.find((id: string) => id !== user.uid);
              const otherUserSnap = await getDoc(doc(db, "profiles", otherUserId));
              if (otherUserSnap.exists()) {
                matchedProfiles.push({ id: otherUserId, ...otherUserSnap.data() } as Profile);
              }
            }
            setMatches(matchedProfiles);
          });

        } else {
          setView('ROLE_SELECT');
        }
      } else {
        setUserProfile(null);
        setMatches([]);
        setView('AUTH');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    if (!auth.currentUser) return;
    setUserProfile({
      id: auth.currentUser.uid,
      name: '',
      role,
      photo: 'https://picsum.photos/seed/' + auth.currentUser.uid + '/600/800',
      location: '',
      bio: '',
      tags: [],
      rating: 5
    });
    setView('PROFILE_EDIT');
  };

  const handleProfileSave = async (updatedProfile: Profile) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "profiles", auth.currentUser.uid), updatedProfile);
      setUserProfile(updatedProfile);
      setView('SWIPE');
    } catch (e) {
      console.error("Error saving profile", e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsNavOpen(false);
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#FF7E5F] to-[#D471ED]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center py-4 px-6 bg-transparent shrink-0 relative z-40">
      <div className="w-10"></div>
      <div className="flex items-center gap-2">
         <div className="bg-white/95 p-2 rounded-xl shadow-md">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="#F26A8D"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
         </div>
         <span className="text-white font-bold text-2xl tracking-tight">NurseMatch</span>
      </div>
      <button 
        onClick={() => setIsNavOpen(true)}
        className="w-10 h-10 flex items-center justify-center text-white"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  );

  return (
    <div className="app-container">
      <main className="flex-1 overflow-hidden flex flex-col">
        {!['AUTH', 'ROLE_SELECT', 'PROFILE_EDIT'].includes(view) && <Header />}
        
        {view === 'AUTH' && <AuthView onLogin={() => {}} />}
        {view === 'ROLE_SELECT' && <RoleSelectView onSelect={handleRoleSelect} />}
        {view === 'PROFILE_EDIT' && userProfile && (
          <ProfileEditView profile={userProfile} onSave={handleProfileSave} />
        )}
        {view === 'SWIPE' && userProfile && (
          <SwipeView 
            userRole={userProfile.role} 
            onMatch={(p) => {}} // Snapshot listener handles match state
            onOpenChat={(p) => {
               setActiveChat({ id: p.id, participant: p, lastMessage: '', messages: [] });
               setView('CHAT_DETAIL');
            }} 
            onToggleNav={() => setIsNavOpen(true)}
          />
        )}
        {view === 'CHATS' && (
          <div className="flex-1 flex flex-col px-4 pb-6 max-w-xl mx-auto w-full">
            <ChatsListView matches={matches} onSelectChat={(p) => {
               setActiveChat({ id: p.id, participant: p, lastMessage: '', messages: [] });
               setView('CHAT_DETAIL');
            }} />
          </div>
        )}
        {view === 'CHAT_DETAIL' && activeChat && (
          <ChatDetailView session={activeChat} onBack={() => setView('CHATS')} />
        )}
        {view === 'SETTINGS' && userProfile && (
          <div className="flex-1 flex flex-col px-4 pb-6 max-w-xl mx-auto w-full">
            <SettingsView 
              profile={userProfile} 
              onEdit={() => setView('PROFILE_EDIT')} 
              onLogout={handleLogout} 
            />
          </div>
        )}
      </main>

      {isNavOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsNavOpen(false)}
        >
          <div 
            className="w-full max-w-lg p-6 animate-in slide-in-from-bottom duration-300 mb-4"
            onClick={e => e.stopPropagation()}
          >
            <Navigation 
              currentView={view} 
              setView={(v) => { setView(v); setIsNavOpen(false); }} 
              onClose={() => setIsNavOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
