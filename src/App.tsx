import React, { useState, useEffect } from 'react';
import DecksTab from './components/DecksTab';
import InvestorsTab from './components/InvestorsTab';
import MentorTab from './components/MentorTab';
import CoFoundersTab from './components/CoFoundersTab';
import { 
  BookOpen, Building, MessageSquare, Briefcase, Sparkles, Award, 
  Zap, HelpCircle, ChevronRight, Check, Lock, Unlock, CreditCard, 
  Shield, RefreshCw, Star, Info, X, TrendingUp, DollarSign, Users, FileText, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation: 'landing' | 'decks' | 'investors' | 'cofounders' | 'mentor'
  const [activeTab, setActiveTab] = useState<'landing' | 'decks' | 'investors' | 'cofounders' | 'mentor'>(() => {
    const isSub = localStorage.getItem('fundraising_is_subscribed') === 'true';
    return isSub ? 'decks' : 'landing';
  });

  // Subscription State (Synced to localStorage)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('fundraising_is_subscribed') === 'true';
  });

  const [subscribedPlan, setSubscribedPlan] = useState<string>(() => {
    return localStorage.getItem('fundraising_subscribed_plan') || 'Venture FastTrack';
  });

  // Startup Profile State (Synced to localStorage for persistence)
  const [startupProfile, setStartupProfile] = useState(() => {
    const local = localStorage.getItem('fundraising_startup_profile');
    if (local) return JSON.parse(local);
    return {
      name: 'Stark Technologies',
      pitch: 'A cloud-native SaaS automating carbon footprint mapping for Fortune 500 logistics firms.',
      sector: 'SaaS & ClimateTech',
      stage: 'Seed',
      traction: '$15k MRR growing 15% MoM with 4 closed pilot contracts.'
    };
  });

  // Saving state for the profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileTemp, setProfileTemp] = useState({ ...startupProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: string; tier: 'founder' | 'venture' }>({
    name: 'Venture FastTrack',
    price: '$49/mo',
    tier: 'venture'
  });

  // Checkout Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVC, setCardCVC] = useState('123');
  const [cardName, setCardName] = useState('Tony Stark');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // AI Prompt bridge: Allows clicking "Ask Mentor" from pitch deck/investor to transition to Chat with a pre-set prompt
  const [initialMentorPrompt, setInitialMentorPrompt] = useState<string | undefined>(undefined);

  // Sync profile and subscription to local storage
  useEffect(() => {
    localStorage.setItem('fundraising_startup_profile', JSON.stringify(startupProfile));
  }, [startupProfile]);

  useEffect(() => {
    localStorage.setItem('fundraising_is_subscribed', String(isSubscribed));
    localStorage.setItem('fundraising_subscribed_plan', subscribedPlan);
  }, [isSubscribed, subscribedPlan]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStartupProfile({ ...profileTemp });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  const handleBridgeToMentor = (promptText: string) => {
    if (!isSubscribed) {
      triggerCheckout('Venture FastTrack', '$49/mo', 'venture');
      return;
    }
    setInitialMentorPrompt(promptText);
    setActiveTab('mentor');
  };

  const triggerCheckout = (planName: string, price: string, tier: 'founder' | 'venture') => {
    setCheckoutPlan({ name: planName, price, tier });
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
    setShowCheckoutModal(true);
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);

    // Simulate standard secure Stripe/banking handshake thread
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        setIsSubscribed(true);
        setSubscribedPlan(checkoutPlan.name);
        setShowCheckoutModal(false);
        setActiveTab('decks'); // Immediately transition to unlocked content
      }, 1500);
    }, 2000);
  };

  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to deactivate your premium workspace? This returns the application to the locked landing page sandbox state for demonstration purposes.")) {
      setIsSubscribed(false);
      setSubscribedPlan('');
      setActiveTab('landing');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans" id="app-root-container">
      
      {/* 1. Top Hero Navigation Header Bar */}
      <header className="bg-neutral-900 text-white border-b border-neutral-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="p-2 rounded-xl bg-amber-500 text-neutral-950 font-extrabold shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">ADVISR HUB</h1>
                <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 text-[9px] font-mono uppercase font-bold rounded border border-amber-500/20">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">Fundraising & Founder Engine</p>
            </div>
          </div>

          {/* Navigation Menu Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('decks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'decks'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>100 Pitch Decks</span>
              {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('investors')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'investors'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Building className="w-3.5 h-3.5 shrink-0" />
              <span>5,000+ Investors</span>
              {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('cofounders')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap relative ${
                activeTab === 'cofounders'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>LinkedIn Co-Founders</span>
              <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
              {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('mentor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'mentor'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>AI Mentor</span>
              {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400 ml-0.5" />}
            </button>
          </nav>

          {/* Right Action Bar: Startup Profile Pill & Subscription Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Startup Profile Pill */}
            <button
              onClick={() => { setProfileTemp({ ...startupProfile }); setIsEditingProfile(true); }}
              className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
              title="Click to configure startup profile"
            >
              <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate">{startupProfile.name}</span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                {startupProfile.stage}
              </span>
            </button>

            {/* Premium Status Action */}
            {isSubscribed ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
                <span className="hidden sm:inline">Premium</span>
                <button
                  onClick={handleCancelSubscription}
                  className="text-[9px] text-neutral-400 hover:text-red-400 underline ml-1 cursor-pointer"
                  title="Deactivate sandbox subscription"
                >
                  Reset
                </button>
              </div>
            ) : (
              <button
                onClick={() => triggerCheckout('Venture FastTrack', '$49/mo', 'venture')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                <span>Get Premium</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. Main Content Workspace Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        
        {/* Sticky Global Top Banner when unsubscribed and browsing gated demo */}
        {!isSubscribed && activeTab !== 'landing' && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center justify-between gap-4 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Gated Sandbox Demo Mode:</strong> You are exploring pitch decks and investor listings. Individual slide breakdowns, raw contact details, and AI features are locked.
              </span>
            </div>
            <button
              onClick={() => triggerCheckout('Venture FastTrack', '$49/mo', 'venture')}
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-950 text-white font-bold rounded-lg text-[11px] transition shrink-0 cursor-pointer shadow-xs"
            >
              Unlock Workspace
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
          >
            
            {/* SUB-TAB 0: LANDING & OUTLINE PAGE */}
            {activeTab === 'landing' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto" id="landing-tab-container">
                {/* Hero Section */}
                <div className="text-center space-y-3.5 py-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/15">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                    <span>The Ultimate Founder Platform</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl">
                    Close Your Funding Round <span className="text-amber-500">10x Faster</span>
                  </h1>
                  <p className="text-neutral-500 text-base max-w-2xl mx-auto leading-relaxed">
                    Study historical slide decks from unicorns, unlock partner contact details for 5,000 active global investors, match with tech founders seeking co-founders on LinkedIn, and test your pitch with an elite AI mentor.
                  </p>
                  
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => triggerCheckout('Venture FastTrack', '$49/mo', 'venture')}
                      className="px-6 py-3 bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold rounded-xl text-xs shadow-md transition transform active:scale-98 flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> Unlock Premium Workspace
                    </button>
                    <button
                      onClick={() => setActiveTab('cofounders')}
                      className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-amber-600" /> Browse Co-Founders Feed
                    </button>
                    <button
                      onClick={() => setActiveTab('decks')}
                      className="px-6 py-3 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Browse Gated Demo Sandbox
                    </button>
                  </div>
                </div>

                {/* Features Bento Outline */}
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">WHAT YOU GET COMPLETE ACCESS TO</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Bento Box 1 */}
                    <div 
                      onClick={() => setActiveTab('decks')}
                      className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 relative overflow-hidden group cursor-pointer hover:border-neutral-300 transition"
                    >
                      <div className="p-2.5 bg-amber-100/50 rounded-xl text-amber-600 w-fit">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">100 Unicorn Pitch Decks</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Slide-by-slide strategic walkthroughs and commentary for legendary companies (Uber, Coinbase, Airbnb) that raised over $1.2B combined.
                      </p>
                      <ul className="text-[11px] text-neutral-600 space-y-1 pt-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> 100 historical slide models
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> VC commentary & highlights
                        </li>
                      </ul>
                      {!isSubscribed && (
                        <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-800 p-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 border border-amber-500/20">
                          <Lock className="w-2.5 h-2.5" /> Gated
                        </div>
                      )}
                    </div>

                    {/* Bento Box 2 */}
                    <div 
                      onClick={() => setActiveTab('investors')}
                      className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 relative overflow-hidden group cursor-pointer hover:border-neutral-300 transition"
                    >
                      <div className="p-2.5 bg-emerald-100/50 rounded-xl text-emerald-600 w-fit">
                        <Building className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">5,000+ Investor Directory</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Access precise partner profiles across VC funds, Angels, and Family Offices. Standardized check sizes and direct email contacts.
                      </p>
                      <ul className="text-[11px] text-neutral-600 space-y-1 pt-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Reveal direct contact emails
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Export custom lists to CSV
                        </li>
                      </ul>
                      {!isSubscribed && (
                        <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-800 p-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 border border-amber-500/20">
                          <Lock className="w-2.5 h-2.5" /> Gated
                        </div>
                      )}
                    </div>

                    {/* Bento Box 3 - LinkedIn Co-Founders */}
                    <div 
                      onClick={() => setActiveTab('cofounders')}
                      className="bg-white p-5 rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/30 to-white shadow-2xs space-y-3 relative overflow-hidden group cursor-pointer hover:border-amber-400 transition"
                    >
                      <div className="p-2.5 bg-amber-500 text-neutral-950 rounded-xl w-fit shadow-2xs">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-neutral-900">LinkedIn Co-Founders Feed</h4>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                          LIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Live AI scraper tracking tech founders actively seeking CTOs, CMOs, and partners on LinkedIn. Includes 1-click AI outreach DM drafter.
                      </p>
                      <ul className="text-[11px] text-neutral-600 space-y-1 pt-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Real-time live scraped feed
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> AI 1-click DM drafter
                        </li>
                      </ul>
                      {!isSubscribed && (
                        <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-800 p-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 border border-amber-500/20">
                          <Lock className="w-2.5 h-2.5" /> Gated
                        </div>
                      )}
                    </div>

                    {/* Bento Box 4 */}
                    <div 
                      onClick={() => setActiveTab('mentor')}
                      className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 relative overflow-hidden group cursor-pointer hover:border-neutral-300 transition"
                    >
                      <div className="p-2.5 bg-blue-100/50 rounded-xl text-blue-600 w-fit">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">AI Fundraising Mentor</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Dynamic chat workspace with our sharp Silicon Valley advisor. Evaluate answers to interview tests and model pre-seed valuation ranges.
                      </p>
                      <ul className="text-[11px] text-neutral-600 space-y-1 pt-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Pitch test grading engine
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Valuation calculators
                        </li>
                      </ul>
                      {!isSubscribed && (
                        <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-800 p-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 border border-amber-500/20">
                          <Lock className="w-2.5 h-2.5" /> Gated
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Featured Live Co-Founders Showcase on Home Page */}
                <div className="bg-neutral-900 text-white p-6 rounded-2xl space-y-4 border border-neutral-800 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                          <UserPlus className="w-4 h-4 text-amber-400" /> 🔥 Live LinkedIn Co-Founder Calls
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-400">Recent posts from tech founders looking for co-founders across AI, HealthTech, and FinTech.</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('cofounders')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Open Live Feed & Scraper</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-100">Alexandre Vance</span>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Growth CMO</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">"Closed $600k pre-seed for Novaflow AI. Looking for a Growth/CMO co-founder to drive B2B SaaS enterprise pilots..."</p>
                      <div className="text-[10px] text-neutral-500 font-mono">San Francisco • Equity 25%-40%</div>
                    </div>

                    <div className="p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-100">Dr. Elena Rostova</span>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Technical CTO</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">"Seeking a Full-Stack / AI Technical Co-founder for MedPulse Health (ICU predictive software validated with 3 hospitals)..."</p>
                      <div className="text-[10px] text-neutral-500 font-mono">Boston / Remote • Equity 30%-50%</div>
                    </div>

                    <div className="p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-100">Marcus Thorne</span>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Technical CTO</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">"Ex-Robinhood VP building cross-border payment rails. $1.2M soft-circled. Looking for Rust/Go lead engineer co-founder..."</p>
                      <div className="text-[10px] text-neutral-500 font-mono">New York • Equity 20%-35%</div>
                    </div>
                  </div>
                </div>

                {/* Pricing / Offer Matrix */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">TRANSPARENT VALUE-FOCUSED PRICING</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    
                    {/* Free Sandbox */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Starter Teaser</span>
                        <h4 className="text-xl font-bold text-neutral-800">Demo Sandbox</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">Explore layout lists, read pitch deck titles, and browse database filters.</p>
                        <div className="text-2xl font-extrabold text-neutral-800 pt-2">$0 <span className="text-xs font-normal text-neutral-400">/ free forever</span></div>
                      </div>

                      <div className="border-t border-neutral-100 pt-4 space-y-3 flex-grow">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>View 100 Pitch Deck Cards</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Search & filter investors directory</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-400 line-through">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>Analyze full deck slide-by-slide</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-400 line-through">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>Access direct investor email contact</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-400 line-through">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>AI Mentor Consulting & Valuation</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('decks')}
                        className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs transition cursor-pointer"
                      >
                        Explore Teaser Sandbox
                      </button>
                    </div>

                    {/* Founder Premium */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Essential Access</span>
                        <h4 className="text-xl font-bold text-neutral-800">Founder Premium</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">Perfect for active outreach campaigns needing core templates and contacts.</p>
                        <div className="text-2xl font-extrabold text-neutral-800 pt-2">$29 <span className="text-xs font-normal text-neutral-400">/ month</span></div>
                      </div>

                      <div className="border-t border-neutral-100 pt-4 space-y-3 flex-grow">
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Unlock ALL 100</strong> Pitch Deck slide analysis</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Reveal 5,000+</strong> direct contact emails</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>LinkedIn Co-Founders Feed</strong> & Scraper</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Export filters & pipelines to CSV</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-400 line-through">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>1-Click AI DM Drafter & Strategic AI Mentor</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerCheckout('Founder Premium', '$29/mo', 'founder')}
                        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-950 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-sm"
                      >
                        Subscribe to Founder Premium
                      </button>
                    </div>

                    {/* Venture FastTrack */}
                    <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-md">
                      <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-neutral-900 text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                        MOST POPULAR
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" /> Complete Suite
                        </span>
                        <h4 className="text-xl font-bold text-neutral-800">Venture FastTrack</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">Full premium intelligence stack. Ideal for founders demanding stellar seed rounds.</p>
                        <div className="text-2xl font-extrabold text-neutral-800 pt-2">$49 <span className="text-xs font-normal text-neutral-400">/ month</span></div>
                      </div>

                      <div className="border-t border-neutral-100 pt-4 space-y-3 flex-grow">
                        <div className="flex items-start gap-2 text-xs text-neutral-600 font-medium">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Everything in Founder Premium</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>1-Click AI DM Drafter</strong> for LinkedIn Co-Founders</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Unlimited AI Mentor</strong> strategic chat</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Interactive VC Mock interview grading</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Dynamic fair valuation calculators</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerCheckout('Venture FastTrack', '$49/mo', 'venture')}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-lg text-xs transition cursor-pointer shadow-md"
                      >
                        Subscribe to Venture FastTrack
                      </button>
                    </div>

                  </div>
                </div>

                {/* FAQ Block */}
                <div className="bg-neutral-100/50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                  <h4 className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider">Frequently Asked Questions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <strong className="text-xs font-bold text-neutral-800">Is this a real charging subscription?</strong>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">No, this is a fully client-side simulated subscription setup for demonstration. You can unlock the workspace instantly with a mock sandbox payment card.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-xs font-bold text-neutral-800">Can I reset my status to locked?</strong>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">Yes! You can reset your workspace status anytime by clicking "Reset Sandbox" in the sidebar footer to test the locked previews again.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'decks' && (
              <DecksTab 
                onAskMentor={handleBridgeToMentor} 
                isSubscribed={isSubscribed}
                onSubscribeClick={() => triggerCheckout('Founder Premium', '$29/mo', 'founder')}
                startupProfile={startupProfile}
              />
            )}
            {activeTab === 'investors' && (
              <InvestorsTab 
                startupProfile={startupProfile} 
                isSubscribed={isSubscribed}
                onSubscribeClick={() => triggerCheckout('Founder Premium', '$29/mo', 'founder')}
              />
            )}
            {activeTab === 'cofounders' && (
              <CoFoundersTab
                startupProfile={startupProfile}
                isSubscribed={isSubscribed}
                onSubscribeClick={() => triggerCheckout('Founder Premium', '$29/mo', 'founder')}
              />
            )}
            {activeTab === 'mentor' && (
              <MentorTab
                startupProfile={startupProfile}
                initialPrompt={initialMentorPrompt}
                onClearInitialPrompt={() => setInitialMentorPrompt(undefined)}
                isSubscribed={isSubscribed}
                onSubscribeClick={() => triggerCheckout('Venture FastTrack', '$49/mo', 'venture')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Collapsible Profile Config Drawer / Modal Overlay */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-800">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Configure Startup Profile</span>
                </div>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-neutral-400 hover:text-neutral-600 font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
                {/* Startup Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">Startup Name</label>
                  <input
                    type="text"
                    required
                    value={profileTemp.name}
                    onChange={(e) => setProfileTemp({ ...profileTemp, name: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
                  />
                </div>

                {/* Startup Pitch */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">One-Sentence Elevator Pitch</label>
                  <input
                    type="text"
                    required
                    value={profileTemp.pitch}
                    onChange={(e) => setProfileTemp({ ...profileTemp, pitch: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
                  />
                </div>

                {/* Sliced Categorical Inputs */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">Industry Sector</label>
                    <input
                      type="text"
                      required
                      value={profileTemp.sector}
                      onChange={(e) => setProfileTemp({ ...profileTemp, sector: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">Raising Stage</label>
                    <select
                      value={profileTemp.stage}
                      onChange={(e) => setProfileTemp({ ...profileTemp, stage: e.target.value })}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
                    >
                      <option value="Pre-seed">Pre-seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                    </select>
                  </div>
                </div>

                {/* Key Traction */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">Key Traction Metric</label>
                  <textarea
                    required
                    value={profileTemp.traction}
                    onChange={(e) => setProfileTemp({ ...profileTemp, traction: e.target.value })}
                    rows={2}
                    className="w-full p-3 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white leading-relaxed resize-none font-sans"
                  />
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Saved!
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Beautiful Interactive Subscription / Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col md:flex-row h-auto"
            >
              {/* Checkout Left Panel: Summary info */}
              <div className="md:w-5/12 bg-neutral-900 text-white p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-400 font-mono tracking-wider uppercase">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" /> Secure Checkout
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-semibold font-mono uppercase">Selected Plan</span>
                    <h3 className="text-lg font-bold text-neutral-100">{checkoutPlan.name}</h3>
                    <p className="text-2xl font-black text-white font-mono mt-0.5">{checkoutPlan.price}</p>
                    <span className="text-[10px] text-neutral-500">Billed monthly. Cancel anytime.</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant Workspace Unlock</span>
                  </div>
                </div>
              </div>

              {/* Checkout Right Panel: Interactive Payment Details Form */}
              <div className="md:w-7/12 p-6 flex flex-col justify-between text-left">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-4">
                  <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-neutral-500" /> Credit Card Details
                  </h4>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="p-1 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 rounded text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {paymentSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center space-y-3 flex-grow flex flex-col justify-center items-center"
                    >
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full animate-bounce">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-sm text-neutral-800">Payment Confirmed!</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Your seed-round toolkit is unlocked. Redirecting to workspace...
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSimulatePayment} className="space-y-4 flex-grow">
                      {/* Virtual Credit Card Graphic */}
                      <div className="p-4 bg-gradient-to-tr from-neutral-800 to-neutral-950 rounded-xl text-white font-mono text-[11px] shadow-md space-y-3 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500">ADVISR PRO</span>
                          <span className="text-[10px] text-neutral-400">VISA</span>
                        </div>
                        <div className="text-sm font-semibold tracking-wider text-neutral-200 mt-2">
                          {cardNumber}
                        </div>
                        <div className="flex justify-between text-[8px] text-neutral-400 pt-1">
                          <div>
                            <span className="block text-[7px] text-neutral-500">CARDHOLDER</span>
                            <strong className="text-neutral-200 truncate max-w-[100px] block">{cardName || 'YOUR NAME'}</strong>
                          </div>
                          <div>
                            <span className="block text-[7px] text-neutral-500">EXPIRES</span>
                            <strong className="text-neutral-200">{cardExpiry}</strong>
                          </div>
                          <div>
                            <span className="block text-[7px] text-neutral-500">CVC</span>
                            <strong className="text-neutral-200">{cardCVC}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold font-mono text-neutral-400 uppercase">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold font-mono text-neutral-400 uppercase">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
                        />
                      </div>

                      {/* Expiry & CVC Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold font-mono text-neutral-400 uppercase">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold font-mono text-neutral-400 uppercase">CVC Code</label>
                          <input
                            type="text"
                            required
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value)}
                            placeholder="123"
                            maxLength={3}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                          />
                        </div>
                      </div>

                      {/* Form Submit button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isProcessingPayment}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-950 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          {isProcessingPayment ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                              <span>Authorizing Secure Sandbox...</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span>Authorize Secure Charge</span>
                            </>
                          )}
                        </button>
                        <div className="text-[9px] text-center text-neutral-400 mt-2 font-mono">
                          ⚡ Any sandbox values will work. Clicking automatically unlocks.
                        </div>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
