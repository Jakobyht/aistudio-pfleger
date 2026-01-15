
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Message } from '../types';

interface ChatDetailViewProps {
  session: ChatSession;
  onBack: () => void;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ session, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-5 flex items-center gap-4 shadow-sm z-10">
        <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors active:scale-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A1FB0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={session.participant.photo} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-black text-gray-900 leading-none tracking-tight">{session.participant.name}</h3>
            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1 block">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="text-4xl mb-4">👋</div>
            <p className="text-gray-400 font-bold">Starte das Gespräch mit {session.participant.name}!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-3.5 rounded-[24px] text-sm font-semibold shadow-sm ${
                msg.senderId === 'me' 
                  ? 'bg-[#7B4AE2] text-white rounded-br-none' 
                  : 'bg-white text-gray-900 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3 items-center max-w-2xl mx-auto">
          <input 
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Nachricht schreiben..."
            className="flex-1 bg-white text-black border-2 border-gray-100 rounded-full px-6 py-4 text-sm font-semibold focus:ring-4 focus:ring-purple-50 focus:border-purple-300 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-gradient-to-tr from-[#7B4AE2] to-[#6A1FB0] text-white flex items-center justify-center rounded-full shadow-lg shadow-purple-200 active:scale-90 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
