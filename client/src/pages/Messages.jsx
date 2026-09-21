import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  MessageSquare, Send, Code2, Users, Search, Paperclip, CheckCircle2 
} from 'lucide-react';

export const Messages = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activePartner) {
      loadMessages(activePartner.id);
    }
  }, [activePartner]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      if (activePartner && message.senderId === activePartner.id) {
        setMessages(prev => [...prev, message]);
      }
      loadConversations();
    };

    socket.on('receive_direct_message', handleIncomingMessage);

    return () => {
      socket.off('receive_direct_message', handleIncomingMessage);
    };
  }, [socket, activePartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConv(true);
    try {
      const data = await api.getConversations();
      setConversations(data);
      if (data.length > 0 && !activePartner) {
        setActivePartner(data[0].partner);
      }
    } catch (err) {
      console.error('Load conversations error:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  const loadMessages = async (partnerId) => {
    try {
      const data = await api.getMessagesWithUser(partnerId);
      setMessages(data);
    } catch (err) {
      console.error('Load messages error:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || !activePartner) return;

    const content = textInput.trim();
    setTextInput('');

    try {
      const msg = await api.sendMessage({
        receiverId: activePartner.id,
        content
      });

      setMessages(prev => [...prev, msg]);

      // Emit real-time socket event
      if (socket) {
        socket.emit('send_direct_message', {
          receiverId: activePartner.id,
          message: msg
        });
      }

      loadConversations();
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-2xl h-[80vh] grid grid-cols-1 md:grid-cols-3">
        
        {/* Conversations Sidebar (1 col) */}
        <div className="border-r border-slate-800 bg-slate-950/60 flex flex-col h-full">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-400" /> Developer Messages
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(c => {
              const isSelected = activePartner && activePartner.id === c.partner.id;
              const isOnline = onlineUsers.has(c.partner.id);
              return (
                <button
                  key={c.partner.id}
                  onClick={() => setActivePartner(c.partner)}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-indigo-600/15 border border-indigo-500/30' : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative">
                    <img src={c.partner.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                    {isOnline && (
                      <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                    )}
                  </div>

                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-100 truncate">{c.partner.fullName}</p>
                      {c.unreadCount > 0 && (
                        <span className="rounded-full bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {c.lastMessage?.content || 'Sent a project link'}
                    </p>
                  </div>
                </button>
              );
            })}

            {conversations.length === 0 && !loadingConv && (
              <p className="p-4 text-center text-xs text-slate-400">No active conversations. Connect with developers on the Teammates page!</p>
            )}
          </div>
        </div>

        {/* Chat Thread Area (2 cols) */}
        <div className="md:col-span-2 flex flex-col h-full bg-slate-900/40">
          {activePartner ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activePartner.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activePartner.fullName}</h3>
                    <p className="text-[11px] text-slate-400">@{activePartner.username}</p>
                  </div>
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, idx) => {
                  const isMine = m.senderId === user.id;
                  return (
                    <div key={m.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}>
                        <p>{m.content}</p>
                        {m.projectLink && (
                          <a href={m.projectLink} target="_blank" rel="noreferrer" className="block mt-2 font-mono text-[11px] underline">
                            🔗 View Attached Project
                          </a>
                        )}
                        <span className="block text-[9px] opacity-70 mt-1 text-right font-mono">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Send direct message to ${activePartner.fullName}...`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-4 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="h-10 w-10 text-slate-500 mb-2" />
              <p className="text-xs">Select a developer conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
