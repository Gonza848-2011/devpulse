import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Moon, ChevronLeft } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const settingsItems = [
    { id: 'profile', icon: User, ...t.settings.items.profile },
    { id: 'notifications', icon: Bell, ...t.settings.items.notifications },
    { id: 'language', icon: Globe, ...t.settings.items.language },
    { id: 'security', icon: Shield, ...t.settings.items.security },
    { id: 'billing', icon: CreditCard, ...t.settings.items.billing },
    { id: 'appearance', icon: Moon, ...t.settings.items.appearance },
  ];

  const renderDetailView = () => {
    const item = settingsItems.find(i => i.id === activeTab);
    if (!item) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <button 
          onClick={() => setActiveTab(null)}
          className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Settings
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-zinc-100 rounded-2xl">
            <item.icon className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{item.label}</h2>
            <p className="text-zinc-500">{item.desc}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-6">
          {activeTab === 'language' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'es', name: 'Español', flag: '🇪🇸' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
                { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                { code: 'it', name: 'Italiano', flag: '🇮🇹' },
                { code: 'pt', name: 'Português', flag: '🇵🇹' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                    language === lang.code ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Display Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all" />
                </div>
              </div>
              <button className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all">
                Save Changes
              </button>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-8 max-w-4xl min-h-screen">
      <AnimatePresence mode="wait">
        {!activeTab ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h1 className="text-3xl font-bold mb-8">{t.settings.title}</h1>

            <div className="space-y-6">
              {settingsItems.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveTab(item.id)}
                  className="bg-white p-6 rounded-3xl border border-zinc-200 flex items-center justify-between hover:border-zinc-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-zinc-100 transition-colors">
                      <item.icon className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{item.label}</h3>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100">
                    <span className="text-zinc-400">→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-rose-50 rounded-3xl border border-rose-100">
              <h3 className="text-rose-900 font-bold mb-2">{t.settings.danger}</h3>
              <p className="text-rose-700 text-sm mb-6">{t.settings.danger_desc}</p>
              <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all">
                {t.settings.delete}
              </button>
            </div>
          </motion.div>
        ) : (
          <div key="detail">
            {renderDetailView()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
