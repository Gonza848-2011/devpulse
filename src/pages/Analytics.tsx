import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Users, Eye, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const data = [
  { name: 'Mon', views: 4000, users: 2400, clicks: 2400 },
  { name: 'Tue', views: 3000, users: 1398, clicks: 2210 },
  { name: 'Wed', views: 2000, users: 9800, clicks: 2290 },
  { name: 'Thu', views: 2780, users: 3908, clicks: 2000 },
  { name: 'Fri', views: 1890, users: 4800, clicks: 2181 },
  { name: 'Sat', views: 2390, users: 3800, clicks: 2500 },
  { name: 'Sun', views: 3490, users: 4300, clicks: 2100 },
];

export const Analytics = () => {
  const { t } = useLanguage();
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.analytics.title}</h1>
        <p className="text-zinc-500">{t.analytics.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t.analytics.stats.views, value: '124.5k', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t.analytics.stats.users, value: '42.1k', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t.analytics.stats.clicks, value: '12.4%', icon: MousePointer2, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: t.analytics.stats.growth, value: '+24%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-zinc-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">{t.analytics.traffic}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">{t.analytics.engagement}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Top Pages</h3>
          <div className="space-y-4">
            {[
              { path: '/dashboard', views: '45.2k', rate: '+12.5%', color: 'bg-indigo-500' },
              { path: '/marketplace', views: '32.1k', rate: '+8.2%', color: 'bg-emerald-500' },
              { path: '/analytics', views: '12.4k', rate: '-2.1%', color: 'bg-amber-500' },
              { path: '/chat', views: '8.9k', rate: '+24.1%', color: 'bg-rose-500' },
            ].map((page, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className={cn("w-2 h-8 rounded-full", page.color)} />
                  <div>
                    <p className="text-sm font-bold">{page.path}</p>
                    <p className="text-xs text-zinc-500">Direct Traffic</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{page.views}</p>
                  <p className={cn("text-xs font-bold", page.rate.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                    {page.rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6">Device Distribution</h3>
          <div className="flex-grow flex flex-col justify-center space-y-8">
            {[
              { label: 'Desktop', value: 65, color: 'bg-indigo-600' },
              { label: 'Mobile', value: 25, color: 'bg-emerald-500' },
              { label: 'Tablet', value: 10, color: 'bg-amber-500' },
            ].map((device, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{device.label}</span>
                  <span>{device.value}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${device.value}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={cn("h-full rounded-full", device.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
