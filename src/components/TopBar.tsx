import React, { useState } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { Globe, Bell, Search, User, Zap, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { PricingModal } from './PricingModal';

export const TopBar = () => {
  const { language, setLanguage } = useLanguage();
  const { plan } = useUser();
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-200">
          <Globe className="w-4 h-4 text-zinc-400" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs font-bold outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="it">IT</option>
            <option value="pt">PT</option>
          </select>
        </div>

        <button 
          onClick={() => setIsPricingOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95",
            plan === 'Free' ? "bg-zinc-100 border-zinc-200 text-zinc-600" :
            plan === 'Pro' ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-100" :
            "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-100"
          )}
        >
          <Zap className={cn("w-4 h-4", plan === 'Plus' ? "fill-current" : "")} />
          <span className="text-xs font-bold uppercase tracking-wider">{plan}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>

        <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

        <button className="relative p-2 text-zinc-400 hover:text-black transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-zinc-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">Alex Dev</p>
            <p className="text-[10px] text-zinc-500 font-medium">{plan} Plan</p>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
