import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Sparkles, Download, AlertCircle, Zap } from 'lucide-react';
import { generateImage } from '../services/imageLab';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';

export const ImageLab = () => {
  const { t } = useLanguage();
  const { canGenerateImage, incrementImageUsage, remainingImages, plan } = useUser();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading || !canGenerateImage) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateImage(prompt);
      if (result) {
        setImage(result);
        incrementImageUsage();
      } else {
        setError("Failed to generate image.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-indigo-600" />
            {t.imageLab.title}
          </h1>
          <p className="text-zinc-500">{t.imageLab.subtitle}</p>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t.imageLab.usage}</p>
            <p className="text-sm font-bold">{remainingImages} {t.imageLab.remaining}</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            plan === 'Plus' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
          )}>
            <Zap className="w-5 h-5 fill-current" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-zinc-700">{t.imageLab.placeholder}</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all resize-none text-sm"
                placeholder="A futuristic city with neon lights, digital art style..."
              />
            </div>

            {!canGenerateImage && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-900">{t.imageLab.limit_reached}</p>
                  <button className="text-xs font-bold text-rose-600 underline mt-1">{t.imageLab.upgrade}</button>
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !canGenerateImage}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/10"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.imageLab.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.imageLab.generate}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <div className="bg-zinc-100 rounded-3xl border-2 border-dashed border-zinc-200 aspect-square flex items-center justify-center overflow-hidden relative group">
          <AnimatePresence mode="wait">
            {image ? (
              <motion.div 
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full"
              >
                <img src={image} alt="Generated" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={image} 
                    download="generated-image.png"
                    className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Download className="w-6 h-6 text-black" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 px-8"
              >
                <div className="w-16 h-16 bg-zinc-200 rounded-2xl flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-400 text-sm font-medium">Your generated image will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-indigo-600 font-bold animate-pulse">{t.imageLab.generating}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
