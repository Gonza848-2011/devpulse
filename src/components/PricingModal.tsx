import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Zap, Shield, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser, Plan } from '../context/UserContext';
import { cn } from '../lib/utils';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { t } = useLanguage();
  const { plan, setPlan } = useUser();

  const plans: { id: Plan, price: string, color: string, features: string[] }[] = [
    { 
      id: 'Free', 
      price: '0€', 
      color: 'bg-zinc-100 text-zinc-600',
      features: ['2 AI Images / day', 'Basic AI Chat', 'Standard Analytics']
    },
    { 
      id: 'Pro', 
      price: '5€', 
      color: 'bg-indigo-600 text-white',
      features: ['10 AI Images / day', 'Advanced AI Models', 'Priority Support', 'Detailed Analytics']
    },
    { 
      id: 'Plus', 
      price: '15€', 
      color: 'bg-amber-500 text-white',
      features: ['Unlimited AI Images', 'Gemini 3 Pro Access', 'Custom Templates', 'Team Collaboration']
    }
  ];

  const handleSelect = (selectedPlan: Plan) => {
    if (selectedPlan === 'Free') {
      setPlan('Free');
      onClose();
      return;
    }
    
    // Simulate payment
    const confirmed = window.confirm(`Confirm payment of ${plans.find(p => p.id === selectedPlan)?.price} for ${selectedPlan} plan?`);
    if (confirmed) {
      setPlan(selectedPlan);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold">Upgrade your experience</h2>
                  <p className="text-zinc-500">Choose the plan that fits your creative needs</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <div 
                    key={p.id}
                    className={cn(
                      "relative p-8 rounded-[32px] border-2 transition-all flex flex-col",
                      plan === p.id ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"
                    )}
                  >
                    {plan === p.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Current Plan
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">{p.id}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{p.price}</span>
                        <span className="text-zinc-400 text-sm">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => handleSelect(p.id)}
                      disabled={plan === p.id}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold transition-all",
                        plan === p.id 
                          ? "bg-zinc-200 text-zinc-400 cursor-default" 
                          : p.id === 'Pro' 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200" 
                            : p.id === 'Plus'
                              ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200"
                              : "bg-black text-white hover:bg-zinc-800"
                      )}
                    >
                      {plan === p.id ? 'Active' : `Get ${p.id}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
