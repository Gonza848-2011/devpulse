import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Github, 
  Zap, 
  Shield, 
  Rocket, 
  ChevronRight, 
  Sparkles,
  Code,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  highlight = false,
  cta = "Get Started"
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  highlight?: boolean,
  cta?: string
}) => {
  const navigate = useNavigate();
  return (
    <div className={cn(
      "relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full",
      highlight 
        ? "bg-black text-white border-black shadow-2xl scale-105 z-10" 
        : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400"
    )}>
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold">{price}€</span>
          <span className={cn("text-sm", highlight ? "text-zinc-400" : "text-zinc-500")}>/month</span>
        </div>
        <p className={cn("text-sm leading-relaxed", highlight ? "text-zinc-300" : "text-zinc-600")}>
          {description}
        </p>
      </div>
      
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <Check className={cn("w-5 h-5 shrink-0", highlight ? "text-emerald-400" : "text-emerald-500")} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => navigate('/dashboard')}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98]",
          highlight 
            ? "bg-white text-black hover:bg-zinc-100" 
            : "bg-black text-white hover:bg-zinc-800"
        )}
      >
        {cta}
      </button>
    </div>
  );
};

export const Landing = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">DevPulse</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">{t.nav.features}</a>
              <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">{t.nav.pricing}</a>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-200">
                <Globe className="w-4 h-4 text-zinc-400" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
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
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95"
              >
                {t.nav.dashboard}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-sm font-medium mb-8">
              <Github className="w-4 h-4" />
              Trusted by 10,000+ Developers
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              {t.hero.title} <br />
              <span className="text-zinc-400">{t.hero.subtitle}</span>
            </h1>
            <p className="text-lg lg:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
              >
                {t.hero.cta}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black border border-zinc-200 rounded-full font-bold text-lg hover:bg-zinc-50 transition-all">
                {t.hero.demo}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-zinc-600">Stop reinventing the wheel. Start building your product.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Powered",
                desc: "Integrated Gemini AI to help you brainstorm and build faster.",
                icon: Sparkles,
                color: "text-indigo-600",
                bg: "bg-indigo-100"
              },
              {
                title: "Modern Stack",
                desc: "React 19, Tailwind 4, and Vite for lightning fast development.",
                icon: Code,
                color: "text-emerald-600",
                bg: "bg-emerald-100"
              },
              {
                title: "Secure by Default",
                desc: "Enterprise-grade security and best practices baked in.",
                icon: Shield,
                color: "text-rose-600",
                bg: "bg-rose-100"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 hover:shadow-xl transition-all group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-600">Choose the plan that's right for your project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <PricingCard 
              title={t.pricing.free}
              price="0"
              description="Perfect for side projects and learning."
              features={[
                "Up to 3 projects",
                "Basic AI features",
                "Community support",
                "Public deployments"
              ]}
            />
            <PricingCard 
              title={t.pricing.pro}
              price="5"
              highlight={true}
              description="For developers who are serious about shipping."
              features={[
                "Unlimited projects",
                "Advanced AI tools",
                "Priority support",
                "Custom domains",
                "Private deployments",
                "Analytics dashboard"
              ]}
              cta={t.pricing.cta}
            />
            <PricingCard 
              title={t.pricing.plus}
              price="10"
              description="The ultimate package for power users."
              features={[
                "Everything in Pro",
                "Team collaboration",
                "Custom AI training",
                "White-label options",
                "API access",
                "Dedicated account manager"
              ]}
              cta={t.pricing.cta}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
