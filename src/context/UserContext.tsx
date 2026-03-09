import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Plan = 'Free' | 'Pro' | 'Plus';

interface UserContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  imageUsage: number;
  incrementImageUsage: () => void;
  canGenerateImage: boolean;
  remainingImages: number | '∞';
  templateLimit: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const PLAN_LIMITS: Record<Plan, number> = {
  'Free': 2,
  'Pro': 10,
  'Plus': Infinity
};

const TEMPLATE_LIMITS: Record<Plan, number> = {
  'Free': 5,
  'Pro': 10,
  'Plus': 20
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<Plan>(() => {
    const saved = localStorage.getItem('devpulse_plan');
    return (saved as Plan) || 'Free';
  });

  const [usageData, setUsageData] = useState<{ date: string, count: number }>(() => {
    const saved = localStorage.getItem('devpulse_usage');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return { date: today, count: 0 };
  });

  useEffect(() => {
    localStorage.setItem('devpulse_plan', plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('devpulse_usage', JSON.stringify(usageData));
  }, [usageData]);

  const incrementImageUsage = () => {
    setUsageData(prev => ({ ...prev, count: prev.count + 1 }));
  };

  const limit = PLAN_LIMITS[plan];
  const canGenerateImage = usageData.count < limit;
  const remainingImages = limit === Infinity ? '∞' : Math.max(0, limit - usageData.count);
  const templateLimit = TEMPLATE_LIMITS[plan];

  return (
    <UserContext.Provider value={{ 
      plan, 
      setPlan, 
      imageUsage: usageData.count, 
      incrementImageUsage, 
      canGenerateImage,
      remainingImages,
      templateLimit
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
