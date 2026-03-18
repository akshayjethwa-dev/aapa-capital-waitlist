import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../utils';

// --- Toast Component ---
interface ToastProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | '';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ isOpen, message, type, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-md pointer-events-none"
        >
          <div className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl pointer-events-auto",
            type === 'success' 
              ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          )}>
            <div className="mt-0.5">
              {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity p-1 -mr-2 -mt-1 rounded-full hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-navy-800 border border-white/10 rounded-3xl p-6 z-50 max-w-md mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-neon-green text-navy-900 font-bold hover:brightness-110 active:scale-95 disabled:opacity-70 disabled:active:scale-100',
    secondary: 'bg-navy-700 text-white font-semibold hover:bg-navy-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100',
    outline: 'border border-neon-green/30 text-neon-green font-semibold hover:bg-neon-green/5 active:scale-95 disabled:opacity-70 disabled:active:scale-100',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5 active:scale-95 disabled:opacity-70 disabled:active:scale-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  };

  return (
    <motion.button
      whileTap={props.disabled ? {} : { scale: 0.96 }}
      className={cn(
        'transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};