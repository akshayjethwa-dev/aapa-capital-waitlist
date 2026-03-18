import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './UI';
import { ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Smart Trading Tools",
    description: "Aapa Capital will offer stock and F&O trading with smart tools (under development).",
    icon: "📈"
  },
  {
    id: 2,
    title: "Early Access",
    description: "In this app you can only join the waitlist and get updates.",
    icon: "🚀"
  },
  {
    id: 3,
    title: "Stay Notified",
    description: "We will notify you when the full trading app is live, subject to regulatory approvals.",
    icon: "🔔"
  }
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const setStep = useAppStore((state) => state.setStep);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setStep('main');
    }
  };

  return (
    <div className="h-screen w-full bg-navy-900 flex flex-col overflow-hidden">
      <div className="pt-12 flex justify-center">
        <div className="bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-full">
          <span className="text-neon-green text-[10px] font-bold uppercase tracking-widest">Waitlist App</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="text-8xl mb-12">{SLIDES[currentSlide].icon}</div>
            <h2 className="text-3xl font-bold text-white mb-6">{SLIDES[currentSlide].title}</h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-neon-green' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Button 
          fullWidth 
          size="lg" 
          onClick={nextSlide}
          className="group"
        >
          {currentSlide === SLIDES.length - 1 ? 'Continue to Pre-Registration' : 'Next'}
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
