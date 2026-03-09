import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Marketplace } from './pages/Marketplace';
import { Analytics } from './pages/Analytics';
import { AIChat } from './pages/AIChat';
import { ImageLab } from './pages/ImageLab';
import { Studio3D } from './pages/Studio3D';
import { Settings } from './pages/Settings';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <TopBar />
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/image-lab" element={<ImageLab />} />
            <Route path="/studio-3d" element={<Studio3D />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </UserProvider>
    </LanguageProvider>
  );
}
