import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './UI';

export const SplashScreen: React.FC = () => {
  const setStep = useAppStore((state) => state.setStep);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-navy-900">
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-green rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <div className="w-20 h-20 bg-neon-green rounded-3xl rotate-12 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,255,148,0.3)]">
            <span className="text-navy-900 text-4xl font-black -rotate-12">A</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
        >
          The Future of Finance <br />
          <span className="text-neon-green">is Coming.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-full mb-6"
        >
          <span className="text-neon-green text-xs font-bold uppercase tracking-widest">Waitlist App</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-lg mb-12 max-w-xs"
        >
          Experience the next generation of trading with Aapa Capital.
        </motion.p>

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Button 
            size="lg" 
            className="shadow-[0_0_20px_rgba(0,255,148,0.4)]"
            onClick={() => setStep('onboarding')}
          >
            Join the Waitlist
          </Button>
        </motion.div>
      </div>

      {/* Permanent Disclaimer */}
      <div className="absolute bottom-8 left-0 right-0 px-8 text-center">
        <p className="text-[10px] text-white/30 leading-relaxed max-w-xs mx-auto">
          Aapa Capital is currently in closed beta. Joining the waitlist does not guarantee immediate access to financial services.
        </p>
      </div>
    </div>
  );
};
