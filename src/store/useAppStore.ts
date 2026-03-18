import { create } from 'zustand';

type AppStep = 'splash' | 'onboarding' | 'main';
type Tab = 'home' | 'features' | 'learn' | 'profile';

export interface WaitlistEntry {
  name: string;
  email: string;
  phone: string;
  city: string;
}

interface AppState {
  step: AppStep;
  activeTab: Tab;
  isWaitlistModalOpen: boolean;
  isDevDialogOpen: boolean;
  isPrivacyModalOpen: boolean;
  isAboutModalOpen: boolean;
  devDialogMessage: string;
  waitlistEntries: WaitlistEntry[];
  
  // New States
  user: { name: string; isRegistered: boolean } | null;
  toast: { message: string; type: 'success' | 'error' | ''; isOpen: boolean };

  setStep: (step: AppStep) => void;
  setActiveTab: (tab: Tab) => void;
  setWaitlistModalOpen: (open: boolean) => void;
  setPrivacyModalOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  showDevDialog: (message?: string) => void;
  closeDevDialog: () => void;
  addWaitlistEntry: (entry: WaitlistEntry) => void;
  setUser: (name: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

// Retrieve user from Local Storage
const getStoredUser = () => {
  try {
    const item = localStorage.getItem('aapa_user');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const useAppStore = create<AppState>((set) => ({
  step: 'splash',
  activeTab: 'home',
  isWaitlistModalOpen: false,
  isDevDialogOpen: false,
  isPrivacyModalOpen: false,
  isAboutModalOpen: false,
  devDialogMessage: 'Full trading app is under development. This preregistration app is for waitlist & updates only.',
  waitlistEntries: [],
  user: getStoredUser(),
  toast: { message: '', type: '', isOpen: false },

  setStep: (step) => set({ step }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWaitlistModalOpen: (open) => set({ isWaitlistModalOpen: open }),
  setPrivacyModalOpen: (open) => set({ isPrivacyModalOpen: open }),
  setAboutModalOpen: (open) => set({ isAboutModalOpen: open }),
  showDevDialog: (message) => set({ 
    isDevDialogOpen: true, 
    devDialogMessage: message || 'Full trading app is under development. This preregistration app is for waitlist & updates only.' 
  }),
  closeDevDialog: () => set({ isDevDialogOpen: false }),
  addWaitlistEntry: (entry) => set((state) => ({ waitlistEntries: [...state.waitlistEntries, entry] })),
  
  // Save user to Local Storage so they stay logged in
  setUser: (name) => {
    const userData = { name, isRegistered: true };
    localStorage.setItem('aapa_user', JSON.stringify(userData));
    set({ user: userData });
  },

  // Toast controls
  showToast: (message, type) => {
    set({ toast: { message, type, isOpen: true } });
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, isOpen: false } }));
    }, 4000); // Auto-hide after 4 seconds
  },
  hideToast: () => set((state) => ({ toast: { ...state.toast, isOpen: false } }))
}));