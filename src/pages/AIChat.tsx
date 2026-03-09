import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const AIChat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: t.chat.initial }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: "You are a helpful coding assistant for the DevPulse platform." }
      });
      
      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm flex-grow flex flex-col overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Bot className="text-indigo-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold">{t.chat.title}</h2>
              <p className="text-xs text-zinc-500">{t.chat.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: "Chat cleared. How can I help?" }])}
            className="p-2 text-zinc-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'assistant' ? "bg-indigo-100 text-indigo-600" : "bg-zinc-900 text-white"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed prose prose-sm max-w-none",
                msg.role === 'assistant' ? "bg-zinc-50 border border-zinc-100" : "bg-black text-white"
              )}>
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-zinc-100" />
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 w-32 h-10" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.chat.placeholder}
              className="w-full pl-4 pr-12 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
