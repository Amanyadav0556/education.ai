import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Send, Bot, User as UserIcon, Sparkles, Paperclip, Mic, Plus, MessageSquare, Image as ImageIcon, FileText, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

export default function AICoach() {
 const { token } = useAuth();

 // Chat State
 const [messages, setMessages] = useState([
 { id: 1, type: 'ai', text: 'Hello! I am AceCoach AI. What specific concept would you like to explore today?' }
 ]);
 const [input, setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);

 // File and Voice State
 const [attachedFile, setAttachedFile] = useState(null);
 const [isRecording, setIsRecording] = useState(false);
 const fileInputRef = useRef(null);
 const scrollRef = useRef(null);

 const [currentChatId, setCurrentChatId] = useState(Date.now().toString());
 const [chatHistory, setChatHistory] = useState([]);

 // Initialize history from cache
 useEffect(() => {
 const savedChats = JSON.parse(localStorage.getItem('acecoach_chats') || '[]');
 setChatHistory(savedChats);
 if (savedChats.length > 0) {
 setCurrentChatId(savedChats[0].id);
 setMessages(savedChats[0].messages);
 }
 }, []);

 // Auto-save messages to active chat session
 useEffect(() => {
 if (messages.length <= 1) return; // Don't save empty/default sessions

 setChatHistory(prev => {
 const h = [...prev];
 const idx = h.findIndex(c => c.id === currentChatId);
 // Title is the first user message
 const userMsg = messages.find(m => m.type === 'user')?.text || 'New Session';

 const session = {
 id: currentChatId,
 title: userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg,
 date: new Date().toLocaleDateString(),
 messages: messages
 };

 if (idx >= 0) h[idx] = session;
 else h.unshift(session);

 localStorage.setItem('acecoach_chats', JSON.stringify(h));
 return h;
 });
 }, [messages, currentChatId]);

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
 }
 }, [messages, isTyping]);

 const handleFileAttach = (e) => {
 const file = e.target.files[0];
 if (file) {
 const isImage = file.type.includes('image');
 setAttachedFile({
 name: file.name,
 type: isImage ? 'image' : 'document',
 preview: isImage ? URL.createObjectURL(file) : null
 });
 }
 };

 const handleSend = async (e) => {
 e.preventDefault();
 const userText = input.trim();
 if (!userText && !attachedFile) return;

 const newMessages = [...messages, {
 id: Date.now(),
 type: 'user',
 text: userText,
 attachedFile: attachedFile
 }];

 setMessages(newMessages);
 setInput('');
 setAttachedFile(null); // clear attachment after sending
 setIsTyping(true);

 try {
 // Reformat messages for OpenAI standard: [{ role: 'user', content: '...' }]
 const formattedMessages = newMessages.map(m => ({
 role: m.type === 'ai' ? 'assistant' : 'user',
 content: m.text || (m.attachedFile ? `[User uploaded ${m.attachedFile.name}]` : "...")
 }));

 // Use internal API Axios wrapper which automatically injects the valid JWT Bearer header
 const { data } = await api.post('/chat', { messages: formattedMessages });

 setMessages(p => [...p, {
 id: Date.now(),
 type: 'ai',
 text: data.reply || data.error || "Something went wrong parsing the API response."
 }]);

 } catch (err) {
 console.error(err);
 const errorMsg = err.response?.data?.error || "Network error trying to reach the local backend.";
 setMessages(p => [...p, { id: Date.now(), type: 'ai', text: errorMsg }]);
 } finally {
 setIsTyping(false);
 }
 };

 const handleNewChat = () => {
 setCurrentChatId(Date.now().toString());
 setMessages([{ id: Date.now(), type: 'ai', text: 'New session started! What do you want to learn next?' }]);
 };

 const loadChat = (chatId) => {
 const target = chatHistory.find(c => c.id === chatId);
 if (target) {
 setCurrentChatId(target.id);
 setMessages(target.messages);
 }
 };

 return (
 <DashboardLayout>
 <div className="flex h-[calc(100vh-8rem)] gap-6">

 {/* ChatGPT Style Sidebar: History Panel */}
 <div className="w-64 bg-bg-surface shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-border-base rounded-2xl hidden md:flex flex-col overflow-hidden">
 <div className="p-4 border-b border-border-base">
 <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 text-[#4f46e5] font-bold rounded-xl py-3 transition-colors text-sm">
 <Plus size={18} /> New Chat
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">

 <div>
 <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 px-2">Your Conversations</p>
 <div className="space-y-1">
 {chatHistory.length === 0 && <p className="px-2 text-xs text-text-muted font-medium italic">No recent chats.</p>}
 {chatHistory.map(chat => (
 <button
 key={chat.id}
 onClick={() => loadChat(chat.id)}
 className={`w-full text-left truncate px-3 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${currentChatId === chat.id ? 'bg-[#4f46e5]/10 text-[#4f46e5]' : 'hover:bg-bg-surface-hover text-text-sub '}`}
 >
 <MessageSquare size={16} className={currentChatId === chat.id ? "text-[#4f46e5] flex-shrink-0" : "text-text-muted flex-shrink-0"} />
 <span className="truncate">{chat.title}</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Main Chat Interface */}
 <div className="flex-1 bg-bg-surface rounded-2xl flex flex-col overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-border-base">

 {/* Header */}
 <div className="px-6 py-4 border-b border-border-base flex items-center gap-4 bg-bg-surface-hover">
 <div className="w-12 h-12 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5] shadow-sm">
 <Bot size={24} />
 </div>
 <div>
 <h2 className="font-bold text-lg text-text-main">AceCoach AI</h2>
 <p className="text-[13px] text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
 <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
 Connected to real API Logic
 </p>
 </div>
 </div>

 {/* Messages Scroll Area */}
 <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-surface-hover">
 {messages.map((m) => (
 <div key={m.id} className={`flex gap-4 ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
 <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.type === 'user' ? 'bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white' : 'bg-bg-surface shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-border-base text-[#4f46e5]'}`}>
 {m.type === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
 </div>
 <div className={`max-w-[75%] rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] text-[15px] leading-relaxed font-medium whitespace-pre-wrap ${m.type === 'user' ? 'bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white rounded-tr-sm border border-indigo-500/20' : 'bg-bg-surface border border-border-base text-text-main rounded-tl-sm'}`}>

 {/* Render UI for attached files sent in message */}
 {m.attachedFile && (
 <div className="mb-3">
 {m.attachedFile.preview ? (
 <img src={m.attachedFile.preview} alt="uploaded" className="max-w-[250px] mb-2 rounded-lg shadow-sm border border-black/10" />
 ) : (
 <div className="px-3 py-2 bg-bg-surface rounded-lg flex items-center gap-2 max-w-max border border-white/30 truncate">
 <FileText size={16} />
 <span className="text-sm font-semibold truncate">{m.attachedFile.name}</span>
 </div>
 )}
 </div>
 )}

 {m.text}
 </div>
 </div>
 ))}
 {isTyping && (
 <div className="flex gap-4">
 <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-bg-surface-hover text-[#4f46e5]">
 <Bot size={18} />
 </div>
 <div className="bg-bg-surface border border-border-base rounded-2xl rounded-tl-sm px-5 py-4 flex items-center space-x-1shadow-sm">
 <div className="flex items-center space-x-1 text-[#4f46e5]">
 <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
 <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
 <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Input Area */}
 <div className="p-4 bg-bg-surface border-t border-border-base">

 {/* File Upload Pending Render */}
 {attachedFile && (
 <div className="mb-3">
 <div className="inline-flex items-center gap-2 px-3 py-2 bg-bg-surface-hover rounded-lg border border-border-strong">
 {attachedFile.type === 'image' ? <ImageIcon size={16} className="text-text-sub" /> : <FileText size={16} className="text-text-sub" />}
 <span className="text-xs font-semibold text-text-sub max-w-[150px] truncate">{attachedFile.name}</span>
 <button type="button" onClick={() => setAttachedFile(null)} className="p-1 hover:bg-gray-200 rounded-full text-text-sub transition-colors">
 <X size={14} />
 </button>
 </div>
 </div>
 )}

 {/* Hidden File Input */}
 <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" accept="image/*,.pdf,.doc,.txt" />

 {/* Beautiful Input Bar */}
 <form onSubmit={handleSend} className="relative flex items-center">
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="absolute left-4 text-text-muted hover:text-[#4f46e5] transition-colors cursor-pointer p-1 rounded-md hover:bg-bg-surface-hover"
 >
 <Paperclip size={20} />
 </button>

 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Message AceCoach AI..."
 className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl py-4 pl-14 pr-28 outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5] transition-all font-medium text-sm placeholder:text-text-muted"
 />

 <div className="absolute right-2 flex items-center gap-1">
 {isRecording ? (
 <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-500 animate-pulse border border-red-100">
 <div className="w-2 h-2 rounded-full bg-red-500"></div>
 <span className="text-xs font-bold">Listening...</span>
 <button type="button" onClick={() => setIsRecording(false)} className="ml-1 text-text-sub hover:text-red-700">
 <X size={14} />
 </button>
 </div>
 ) : (
 <button type="button" onClick={() => setIsRecording(true)} className="p-2 text-text-muted hover:text-[#4f46e5] rounded-lg hover:bg-bg-surface-hover transition-colors">
 <Mic size={20} />
 </button>
 )}
 <button
 type="submit"
 disabled={!input.trim() && !attachedFile}
 className="p-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-all active:scale-[0.97]"
 >
 <Send size={18} className={(input.trim() || attachedFile) ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
