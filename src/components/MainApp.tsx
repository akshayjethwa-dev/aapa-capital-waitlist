import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutGrid, BookOpen, User, ArrowRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button, Modal, Toast } from './UI';

// --- FIREBASE IMPORTS ---
import { collection, addDoc, query, where, getDocs, or } from 'firebase/firestore';
import { db } from '../firebase'; 
// ------------------------

export const MainApp: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isWaitlistModalOpen, 
    setWaitlistModalOpen,
    isDevDialogOpen,
    closeDevDialog,
    devDialogMessage,
    isPrivacyModalOpen,
    setPrivacyModalOpen,
    isAboutModalOpen,
    setAboutModalOpen,
    addWaitlistEntry,
    toast,
    showToast,
    hideToast,
    setUser
  } = useAppStore();

  // Waitlist Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', customCity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => {
    setWaitlistModalOpen(false);
    setFormData({ name: '', email: '', phone: '', city: '', customCity: '' });
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    // Resolve final city choice
    const finalCity = formData.city === 'Other' ? formData.customCity.trim() : formData.city;

    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!finalCity) {
      showToast('Please select or enter your city.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const waitlistRef = collection(db, "waitlist");

      // Check Firebase for duplicates using the OR operator
      const duplicateQuery = query(
        waitlistRef,
        or(
          where("email", "==", formData.email),
          where("phone", "==", formData.phone)
        )
      );

      const querySnapshot = await getDocs(duplicateQuery);

      if (!querySnapshot.empty) {
        showToast('Warning: This email or phone number is already on the waitlist.', 'error');
        setIsSubmitting(false);
        return;
      }

      const newEntry = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: finalCity,
        timestamp: new Date().toISOString()
      };

      // If no duplicates, add the new document to Firebase
      await addDoc(waitlistRef, newEntry);

      // Update local state and persistence
      addWaitlistEntry(newEntry);
      setUser(formData.name);
      
      showToast('Registration successful! You are securely on the waitlist.', 'success');
      handleCloseModal();
      
    } catch (error) {
      console.error("Error adding document: ", error);
      showToast('An error occurred while registering. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'features': return <FeaturesTab />;
      case 'learn': return <LearnTab />;
      case 'profile': return <ProfileTab />;
    }
  };

  return (
    <div className="h-screen w-full bg-navy-900 flex flex-col relative">
      {/* Toast Notification Component */}
      <Toast 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-navy-800/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center pb-8">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={24} />} label="Home" />
        <NavButton active={activeTab === 'features'} onClick={() => setActiveTab('features')} icon={<LayoutGrid size={24} />} label="Features" />
        <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={24} />} label="Learn" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={24} />} label="Profile" />
      </div>

      {/* Waitlist Modal */}
      <Modal isOpen={isWaitlistModalOpen} onClose={handleCloseModal} title="Join the Waitlist">
        <form className="space-y-4" onSubmit={handleWaitlistSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-navy-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none transition-colors" 
            required 
            disabled={isSubmitting}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-navy-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none transition-colors" 
            required 
            disabled={isSubmitting}
          />
          
          {/* Indian Phone Input Formatter */}
          <div className="flex w-full bg-navy-700 border border-white/10 rounded-xl overflow-hidden focus-within:border-neon-green transition-colors">
            <div className="px-4 py-3 bg-white/5 text-white/60 border-r border-white/10 flex items-center justify-center font-medium">
              +91
            </div>
            <input 
              type="tel" 
              placeholder="Mobile Number (10 Digits)" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="flex-1 bg-transparent px-4 py-3 text-white outline-none" 
              required 
              disabled={isSubmitting}
            />
          </div>

          {/* City Selection Formatter */}
          <div className="relative">
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-navy-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none transition-colors appearance-none"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Gandhinagar">Gandhinagar</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Other">Other...</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
              <ChevronDown size={18} />
            </div>
          </div>

          <AnimatePresence>
            {formData.city === 'Other' && (
              <motion.input 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                type="text" 
                placeholder="Enter your custom city" 
                value={formData.customCity}
                onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                className="w-full bg-navy-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none transition-colors" 
                required 
                disabled={isSubmitting}
              />
            )}
          </AnimatePresence>

          <Button fullWidth type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </Button>
          <p className="text-[10px] text-white/40 text-center leading-relaxed">
            Aapa Capital is currently in closed beta. Joining the waitlist does not guarantee immediate access to financial services.
          </p>
        </form>
      </Modal>

      {/* Dev Dialog */}
      <Modal isOpen={isDevDialogOpen} onClose={closeDevDialog} title="Information">
        <div className="space-y-4">
          <p className="text-white/70 leading-relaxed">
            {devDialogMessage}
          </p>
          <Button fullWidth onClick={closeDevDialog}>Understood</Button>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy Policy">
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-sm text-white/70 leading-relaxed no-scrollbar">
          <h4 className="text-white font-bold">Aapa Capital Pre-Launch Privacy Policy</h4>
          <p className="text-xs italic">Effective: March 18, 2026</p>
          <section>
            <h5 className="text-white font-semibold mb-1">1. Introduction</h5>
            <p>Aapa Capital Pre-Launch ("App") is a waitlist app for our upcoming stock trading platform. We collect data transparently to manage pre-registrations.</p>
          </section>
          <section>
            <h5 className="text-white font-semibold mb-1">2. Information We Collect</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Waitlist Form: Name, email, phone, city (voluntary).</li>
              <li>Automatically: Device info, IP address, app usage (no precise location).</li>
              <li>No financial data or logins.</li>
            </ul>
          </section>
        </div>
        <Button fullWidth className="mt-6" onClick={() => setPrivacyModalOpen(false)}>Close</Button>
      </Modal>

      {/* About Modal */}
      <Modal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} title="About Aapa Capital">
        <div className="space-y-4 text-white/70 leading-relaxed">
          <p>
            Aapa Capital is a forward-thinking fintech company based in Ahmedabad, Gujarat. We are building the next generation of trading infrastructure for the Indian markets.
          </p>
          <div className="pt-4 border-t border-white/5">
            <p className="text-sm font-semibold text-white">Contact Support</p>
            <p className="text-neon-green">info@aapacapital.com</p>
          </div>
        </div>
        <Button fullWidth className="mt-6" onClick={() => setAboutModalOpen(false)}>Close</Button>
      </Modal>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-neon-green' : 'text-white/40'}`}
  >
    <motion.div animate={active ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
      {icon}
    </motion.div>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

const HomeTab = () => {
  const { setWaitlistModalOpen, showDevDialog, user } = useAppStore();

  return (
    <div className="p-6 pt-12 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white/60 text-sm font-medium">Welcome to</h2>
            <span className="bg-neon-green/10 text-neon-green text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Waitlist App</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Aapa Capital</h1>
        </div>
        <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center border border-white/10">
          <User size={20} className={user?.isRegistered ? "text-neon-green" : "text-white/60"} />
        </div>
      </div>

      <div className="bg-linear-to-br from-neon-green/20 to-blue-500/20 border border-white/10 rounded-4xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">Pre-Registration</h3>
          <p className="text-white/70 mb-6 max-w-50">Join the early access waitlist for our upcoming trading platform.</p>
          <Button 
            onClick={() => user?.isRegistered 
              ? showDevDialog("You are securely registered on the waitlist. We will notify you when we are ready to launch!") 
              : setWaitlistModalOpen(true)
            }
          >
            {user?.isRegistered ? 'View Your Status' : 'Join Waitlist'}
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/20 blur-3xl rounded-full -mr-16 -mt-16" />
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-semibold px-2">Future Capabilities</h4>
        <div className="space-y-3">
          {['Start Trading', 'Open Demat Account', 'Portfolio Analysis'].map((action) => (
            <button 
              key={action}
              onClick={() => showDevDialog()}
              className="w-full bg-navy-800/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-navy-800 transition-colors"
            >
              <span className="text-white/80 font-medium">{action}</span>
              <ArrowRight size={18} className="text-white/20 group-hover:text-neon-green transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-white/30 text-[10px] leading-relaxed pb-8">
        Aapa Capital is currently in closed beta. Joining the waitlist does not guarantee immediate access to financial services.
      </p>
    </div>
  );
};

const FeaturesTab = () => {
  const showDevDialog = useAppStore(state => state.showDevDialog);
  return (
    <div className="p-6 pt-12 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Features</h1>
      {[
        { title: 'Smart F&O', desc: 'Advanced options chain with real-time Greeks.', icon: '⚡' },
        { title: 'Algo Trading', desc: 'Deploy strategies without writing code.', icon: '🤖' },
        { title: 'Global Stocks', desc: 'Invest in US markets with zero commission.', icon: '🌍' },
      ].map((f) => (
        <div key={f.title} className="bg-navy-800 border border-white/5 p-6 rounded-[28px] space-y-4">
          <div className="text-4xl">{f.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => showDevDialog()}>Learn More</Button>
        </div>
      ))}
    </div>
  );
};

const LearnTab = () => (
  <div className="p-6 pt-12 space-y-6">
    <h1 className="text-3xl font-bold text-white mb-8">Learn</h1>
    <div className="space-y-6">
      {[
        { q: "What is Aapa Capital?", a: "Aapa Capital is a next-generation fintech platform focused on providing smart trading tools for stocks and F&O. We are currently in a pre-launch phase." },
        { q: "How does the waitlist work?", a: "By joining the waitlist, you'll be among the first to be notified when our trading services go live. Access will be granted in phases based on registration order." },
        { q: "Is my data secure?", a: "Yes, we use industry-standard encryption to protect your information. Your data is only used for waitlist updates and regulatory compliance." }
      ].map((item, i) => (
        <div key={i} className="bg-navy-800 border border-white/5 rounded-[28px] overflow-hidden">
          <div className="p-6">
            <p className="text-neon-green text-xs font-bold uppercase mb-2">FAQ</p>
            <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileTab = () => {
  const { setPrivacyModalOpen, setAboutModalOpen, user } = useAppStore();

  return (
    <div className="p-6 pt-12 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-navy-700 rounded-full border-4 border-neon-green/20 flex items-center justify-center text-4xl">
          👤
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {user?.isRegistered ? `Welcome, ${user.name}` : 'Waitlist App'}
          </h2>
          <p className={user?.isRegistered ? "text-neon-green/80 mt-1 font-medium" : "text-white/40"}>
            {user?.isRegistered ? 'Registered Successfully ✓' : 'Not logged in yet'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-semibold px-2">Settings</h4>
        <div className="bg-navy-800 border border-white/5 rounded-4xl overflow-hidden">
          {[
            { label: 'Notifications', link: '#' },
            { label: 'Help & Support', link: 'mailto:info@aapacapital.com' },
          ].map((item, i) => (
            <button 
              key={item.label}
              onClick={() => { if (item.link.startsWith('mailto:')) window.location.href = item.link; }}
              className={`w-full p-5 flex items-center justify-between text-white/70 hover:bg-white/5 transition-colors ${i !== 1 ? 'border-b border-white/5' : ''}`}
            >
              <span>{item.label}</span>
              <ArrowRight size={16} className="opacity-20" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-semibold px-2">Legal</h4>
        <div className="bg-navy-800 border border-white/5 rounded-4xl overflow-hidden">
          {[
            { label: 'Privacy Policy', action: () => setPrivacyModalOpen(true) },
            { label: 'Terms of Service', action: () => window.open('https://example.com/terms', '_blank') },
            { label: 'About Aapa Capital', action: () => setAboutModalOpen(true) },
          ].map((item, i) => (
            <button 
              key={item.label}
              onClick={item.action}
              className={`w-full p-5 flex items-center justify-between text-white/70 hover:bg-white/5 transition-colors ${i !== 2 ? 'border-b border-white/5' : ''}`}
            >
              <span>{item.label}</span>
              <ArrowRight size={16} className="opacity-20" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-white/20 text-[10px] pb-8 pt-4">
        App Version 1.0.0 (Waitlist Edition)
      </p>
    </div>
  );
};