import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  MessageSquare, 
  Image as ImageIcon,
  Rotate3d,
  Settings, 
  LogOut, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, path: '/dashboard' },
    { icon: ShoppingBag, label: t.nav.marketplace, path: '/marketplace' },
    { icon: BarChart3, label: t.nav.analytics, path: '/analytics' },
    { icon: MessageSquare, label: t.nav.chat, path: '/chat' },
    { icon: ImageIcon, label: t.nav.imageLab, path: '/image-lab' },
    { icon: Rotate3d, label: t.nav.studio3d, path: '/studio-3d' },
    { icon: Settings, label: t.nav.settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 h-screen sticky top-0 flex flex-col">
      <Link to="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">DevPulse</span>
      </Link>

      <nav className="flex-grow px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              location.pathname === item.path
                ? "bg-black text-white shadow-lg shadow-black/10"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-100 space-y-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-rose-600 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t.nav.logout}
        </button>
      </div>
    </aside>
  );
};
