import { create } from 'zustand';

type AppStep = 'splash' | 'onboarding' | 'main';
type Tab = 'home' | 'features' | 'learn' | 'profile';

interface AppState {
  step: AppStep;
  activeTab: Tab;
  isWaitlistModalOpen: boolean;
  isDevDialogOpen: boolean;
  isPrivacyModalOpen: boolean;
  isAboutModalOpen: boolean;
  devDialogMessage: string;
  setStep: (step: AppStep) => void;
  setActiveTab: (tab: Tab) => void;
  setWaitlistModalOpen: (open: boolean) => void;
  setPrivacyModalOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  showDevDialog: (message?: string) => void;
  closeDevDialog: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  step: 'splash',
  activeTab: 'home',
  isWaitlistModalOpen: false,
  isDevDialogOpen: false,
  isPrivacyModalOpen: false,
  isAboutModalOpen: false,
  devDialogMessage: 'Full trading app is under development. This preregistration app is for waitlist & updates only.',
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
}));
