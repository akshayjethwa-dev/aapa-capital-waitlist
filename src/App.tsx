/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore } from './store/useAppStore';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { MainApp } from './components/MainApp';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const step = useAppStore((state) => state.step);

  return (
    <div className="h-screen w-full bg-navy-900 text-white overflow-hidden selection:bg-neon-green/30">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <SplashScreen />
          </motion.div>
        )}
        {step === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <Onboarding />
          </motion.div>
        )}
        {step === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <MainApp />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
