import React from 'react';
import { Search, Filter, Download, Star, ExternalLink, Lock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

const items = [
  { title: "Auth Starter", category: "Templates", price: "Free", rating: 4.8, downloads: "1.2k" },
  { title: "Payment Plugin", category: "Plugins", price: "5€", rating: 4.9, downloads: "850" },
  { title: "Admin Dashboard", category: "Templates", price: "10€", rating: 4.7, downloads: "2.1k" },
  { title: "SEO Optimizer", category: "Tools", price: "Free", rating: 4.5, downloads: "3.4k" },
  { title: "Cloud Sync", category: "Plugins", price: "5€", rating: 4.9, downloads: "600" },
  { title: "Dark Theme Pack", category: "UI", price: "Free", rating: 4.6, downloads: "5.2k" },
  { title: "E-commerce Kit", category: "Templates", price: "15€", rating: 4.9, downloads: "1.1k" },
  { title: "Chat Widget", category: "Plugins", price: "Free", rating: 4.4, downloads: "4.2k" },
  { title: "Analytics Pro", category: "Tools", price: "20€", rating: 4.8, downloads: "900" },
  { title: "SaaS Boilerplate", category: "Templates", price: "25€", rating: 4.9, downloads: "1.5k" },
  { title: "Icon Library", category: "UI", price: "Free", rating: 4.7, downloads: "8.1k" },
  { title: "Form Builder", category: "Tools", price: "10€", rating: 4.6, downloads: "1.2k" },
  { title: "Blog Engine", category: "Templates", price: "Free", rating: 4.5, downloads: "2.3k" },
  { title: "Image Optimizer", category: "Tools", price: "5€", rating: 4.8, downloads: "1.4k" },
  { title: "Landing Page V1", category: "Templates", price: "Free", rating: 4.7, downloads: "3.1k" },
  { title: "Stripe Connect", category: "Plugins", price: "15€", rating: 4.9, downloads: "700" },
  { title: "User Feedback", category: "Tools", price: "Free", rating: 4.4, downloads: "1.8k" },
  { title: "Mobile UI Kit", category: "UI", price: "20€", rating: 4.8, downloads: "1.1k" },
  { title: "API Gateway", category: "Tools", price: "30€", rating: 4.9, downloads: "500" },
  { title: "Portfolio Theme", category: "Templates", price: "Free", rating: 4.6, downloads: "2.5k" },
];

export const Marketplace = () => {
  const { t } = useLanguage();
  const { templateLimit, plan } = useUser();

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.marketplace.title}</h1>
          <p className="text-zinc-500">{t.marketplace.subtitle}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            {plan} Plan: {templateLimit} Templates Available
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder={t.marketplace.search}
                className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none w-64"
              />
            </div>
            <button className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => {
          const isLocked = i >= templateLimit;
          return (
            <div 
              key={i} 
              className={cn(
                "bg-white rounded-3xl border border-zinc-200 overflow-hidden transition-all group relative",
                isLocked ? "opacity-75 grayscale-[0.5]" : "hover:shadow-xl"
              )}
            >
              <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${item.title}/800/450`} 
                  alt={item.title}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    !isLocked && "group-hover:scale-105"
                  )}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold">
                  {item.price}
                </div>
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-6 text-center">
                    <Lock className="w-8 h-8 mb-2" />
                    <p className="text-sm font-bold">Locked for your plan</p>
                    <p className="text-[10px] opacity-80 mt-1 uppercase tracking-wider">Upgrade to unlock</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{item.category}</span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <Download className="w-4 h-4" />
                    {item.downloads} {t.marketplace.installs}
                  </div>
                  <button 
                    disabled={isLocked}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isLocked ? "bg-zinc-100 text-zinc-300" : "bg-zinc-900 text-white hover:bg-black"
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
