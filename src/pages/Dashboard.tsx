import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layout, 
  Sparkles,
  Rocket,
  Star,
  Globe,
  MessageSquare,
  Image as ImageIcon,
  Rotate3d
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateProjectIdea } from '../services/gemini';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [idea, setIdea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const result = await generateProjectIdea(topic);
      setIdea(result || "No idea generated.");
    } catch (err) {
      setIdea("Failed to generate idea. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.dashboard.welcome}</h1>
        <p className="text-zinc-500">{t.dashboard.subtitle}</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <Sparkles className="text-indigo-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t.dashboard.brainstormer}</h2>
            <p className="text-zinc-500 text-sm">{t.dashboard.brainstormer_desc}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700">{t.dashboard.interest_label}</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.dashboard.interest_placeholder}
                className="flex-grow px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? t.dashboard.generating : t.dashboard.generate}
                {!loading && <Rocket className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {idea && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 prose prose-zinc max-w-none"
            >
              <Markdown>{idea}</Markdown>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t.dashboard.stats.active, value: "12", icon: Layout, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t.dashboard.stats.stars, value: "1.2k", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
          { label: t.dashboard.stats.deployments, value: "48", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl transition-colors", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-black rounded-full" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "New Project", icon: Rocket, path: "/dashboard" },
              { icon: MessageSquare, label: t.nav.chat, path: '/chat' },
              { icon: ImageIcon, label: t.nav.imageLab, path: '/image-lab' },
              { icon: Rotate3d, label: t.nav.studio3d, path: '/studio-3d' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col items-center gap-3 text-center group"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <action.icon className="w-5 h-5 text-zinc-600" />
                </div>
                <span className="text-sm font-bold text-zinc-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-black rounded-full" />
            Recent Activity
          </h3>
          <div className="space-y-6">
            {[
              { user: "Alex", action: "generated a 3D sphere", time: "2m ago", icon: Rotate3d },
              { user: "Sarah", action: "deployed 'Project X'", time: "15m ago", icon: Globe },
              { user: "Gemini", action: "suggested a new CLI tool", time: "1h ago", icon: Sparkles },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {item.user} <span className="font-normal text-zinc-500">{item.action}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{item.time}</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-zinc-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
