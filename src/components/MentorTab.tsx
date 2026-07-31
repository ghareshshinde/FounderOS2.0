import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage } from '../types';
import { 
  MessageSquare, Send, Sparkles, RefreshCw, Trophy, 
  AlertTriangle, Lightbulb, Calculator, HelpCircle, Star, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentorTabProps {
  startupProfile: {
    name: string;
    pitch: string;
    sector: string;
    stage: string;
    traction: string;
  };
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  isSubscribed: boolean;
  onSubscribeClick: () => void;
}

const INTERVIEW_QUESTIONS = [
  {
    id: "q-1",
    category: "Moat & Defensibility",
    question: "What happens when Google, Microsoft, or an incumbent copies your product in three months?",
    context: "Investors want to see proprietary data networks, technological barriers, integrations, or speed-to-market defensibility."
  },
  {
    id: "q-2",
    category: "Team & Execution",
    question: "Why is this the absolute dream team to solve this problem? What unique insight or back-story do you have?",
    context: "Show 'founder-problem fit.' Highlight domain expertise, technical capacity, or exclusive regulatory/industry relationships."
  },
  {
    id: "q-3",
    category: "Traction & CAC/LTV",
    question: "What is your customer acquisition cost (CAC), and what organic loops exist to keep CAC from scaling linearly?",
    context: "Beware the trap of saying 'viral word-of-mouth' without proof. Share customer acquisition channels, conversion rates, and payback period."
  },
  {
    id: "q-4",
    category: "Valuation & Cap Table",
    question: "How did you arrive at your valuation? What are you going to achieve with this funding, and how long does it extend your runway?",
    context: "Investors look for capital efficiency. Always answer with clear growth milestones (e.g. 'This gets us to $150k MRR with 18 months runway')."
  },
  {
    id: "q-5",
    category: "Market Size & Entry",
    question: "Your target sector seems highly fragmented and niche. How do you scale this to a $10 Billion market?",
    context: "Demonstrate a 'wedge strategy'—conquer an underserved niche first, then expand adjacent capabilities to capture massive adjacent TAM."
  }
];

export default function MentorTab({ 
  startupProfile, initialPrompt, onClearInitialPrompt, isSubscribed, onSubscribeClick 
}: MentorTabProps) {
  // Sub-tabs: 'advisor' | 'mock-interview' | 'valuation'
  const [subTab, setSubTab] = useState<'advisor' | 'mock-interview' | 'valuation'>('advisor');

  // --- 1. Advisor Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "msg-welcome",
        role: "model",
        content: `👋 **Welcome to your Fundraising Advisor Board!** I am **Advisr**, your server-side Silicon Valley mentor. 

I've analyzed your startup profile (**${startupProfile.name || "Untitled Startup"}** / **${startupProfile.sector || "General"}**). I can help you structure your deck, optimize traction narratives, or run seed round modeling.

**How can I help you dominate your fundraise today?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- 2. Mock Interview State ---
  const [selectedQuestion, setSelectedQuestion] = useState(INTERVIEW_QUESTIONS[0]);
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // --- 3. Valuation Estimator State ---
  const [currentMRR, setCurrentMRR] = useState(15000);
  const [annualGrowth, setAnnualGrowth] = useState(120);
  const [teamQuality, setTeamQuality] = useState('cofounders'); // 'solo' | 'cofounders' | 'experts' | 'tier1'
  const [marketSizeGrade, setMarketSizeGrade] = useState('healthy'); // 'niche' | 'healthy' | 'massive'
  const [techDefensibility, setTechDefensibility] = useState('medium'); // 'low' | 'medium' | 'high'

  // Scroll chat to bottom on updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Initial Prompts triggered from other tabs (like Pitch Deck details)
  useEffect(() => {
    if (initialPrompt) {
      setSubTab('advisor');
      if (isSubscribed) {
        triggerAIResponse(initialPrompt);
      }
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Trigger Advisor Message Send
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }
    if (!chatInput.trim() || isSendingMessage) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSendingMessage(true);

    await fetchAdvisorResponse([...messages, userMsg]);
  };

  const triggerAIResponse = async (promptText: string) => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSendingMessage(true);

    await fetchAdvisorResponse([...messages, userMsg]);
  };

  const fetchAdvisorResponse = async (allMessages: ChatMessage[]) => {
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages })
      });

      const data = await response.json();
      if (response.ok) {
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: 'model',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          content: `⚠️ Sorry, there was an issue connecting to the AI Mentor: ${data.error || 'Unknown error.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Connection failure: ${err.message || 'Could not connect to Express server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Submit Answer to Mock Interview
  const handleSubmitMockAnswer = async () => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }
    if (!userAnswerInput.trim() || isSubmittingAnswer) return;

    setIsSubmittingAnswer(true);
    setInterviewFeedback('');

    try {
      const response = await fetch('/api/mentor/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          answer: userAnswerInput,
          sector: startupProfile.sector || 'Software technology',
          stage: startupProfile.stage || 'Seed'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setInterviewFeedback(data.feedback);
      } else {
        setInterviewFeedback(`⚠️ Error grading answer: ${data.error || 'Server error occurred.'}`);
      }
    } catch (err: any) {
      setInterviewFeedback(`⚠️ Connection error: ${err.message || 'Could not reach grading engine.'}`);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // --- Valuation Calculator Logic ---
  const calculatedValuation = useMemo(() => {
    const arr = currentMRR * 12;

    let sectorMultiplier = 8; // SaaS default
    const sectorLower = (startupProfile.sector || '').toLowerCase();
    if (sectorLower.includes('ai') || sectorLower.includes('machine learning')) {
      sectorMultiplier = 16;
    } else if (sectorLower.includes('crypto') || sectorLower.includes('web3')) {
      sectorMultiplier = 12;
    } else if (sectorLower.includes('fintech') || sectorLower.includes('bank')) {
      sectorMultiplier = 10;
    } else if (sectorLower.includes('deep') || sectorLower.includes('aerospace') || sectorLower.includes('hardware')) {
      sectorMultiplier = 14;
    }

    let growthBonus = 0;
    if (annualGrowth >= 200) growthBonus = 8;
    else if (annualGrowth >= 100) growthBonus = 4;
    else if (annualGrowth >= 50) growthBonus = 2;
    else if (annualGrowth < 20) growthBonus = -2;

    let finalMultiplier = Math.max(4, sectorMultiplier + growthBonus);
    let baseVal = arr * finalMultiplier;

    if (baseVal < 1500000) {
      baseVal = 1500000;
    }

    let teamFactor = 1.0;
    if (teamQuality === 'solo') teamFactor = 0.85;
    else if (teamQuality === 'experts') teamFactor = 1.15;
    else if (teamQuality === 'tier1') teamFactor = 1.35;

    let marketFactor = 1.0;
    if (marketSizeGrade === 'niche') marketFactor = 0.8;
    else if (marketSizeGrade === 'massive') marketFactor = 1.25;

    let defFactor = 1.0;
    if (techDefensibility === 'low') defFactor = 0.9;
    else if (techDefensibility === 'high') defFactor = 1.15;

    const estimatedValuation = baseVal * teamFactor * marketFactor * defFactor;
    
    const lowRange = Math.round(estimatedValuation * 0.85 / 50000) * 50000;
    const highRange = Math.round(estimatedValuation * 1.15 / 50000) * 50000;

    return {
      low: lowRange.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      high: highRange.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      multiple: finalMultiplier.toFixed(1),
      narrative: `Based on your MRR of $${currentMRR.toLocaleString()} ($${(currentMRR*12).toLocaleString()} ARR) and growth velocity of ${annualGrowth}% YoY, your startup operates in a ${marketSizeGrade} market with a standard sector multiple of ${sectorMultiplier}x ARR. Adjusting for your team pedigree (${teamQuality}), defense index (${techDefensibility}), and current market standards, this yields a capital-efficient fundraising valuation range.`
    };
  }, [currentMRR, annualGrowth, teamQuality, marketSizeGrade, techDefensibility, startupProfile.sector]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[75vh] text-left animate-fade-in" id="mentor-tab-container">
      {/* Top Ribbon selector */}
      <div className="flex border-b border-neutral-200 bg-neutral-50/50 p-2 gap-2 shrink-0">
        <button
          onClick={() => setSubTab('advisor')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'advisor'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> AI Fundraising Mentor
          {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400" />}
        </button>
        <button
          onClick={() => setSubTab('mock-interview')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'mock-interview'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Trophy className="w-4 h-4" /> VC Mock Interview
          {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400" />}
        </button>
        <button
          onClick={() => setSubTab('valuation')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'valuation'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Calculator className="w-4 h-4" /> Valuation Estimator
          {!isSubscribed && <Lock className="w-3 h-3 text-neutral-400" />}
        </button>
      </div>

      {/* Dynamic Sub-Tab Rendering */}
      <div className="flex-grow flex flex-col overflow-hidden min-h-0 relative">
        
        {/* SUB-TAB 1: AI MENTOR CHAT */}
        {subTab === 'advisor' && (
          <div className="flex-grow flex flex-col min-h-0 h-full relative">
            
            {/* FULL LOCK OVERLAY ON ADVISOR CHAT SCREEN */}
            {!isSubscribed && (
              <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 space-y-4 z-20">
                <Lock className="w-10 h-10 text-amber-500 animate-pulse" />
                <h4 className="text-lg font-black text-white tracking-tight">Silicon Valley Advisory Board</h4>
                <p className="text-xs text-neutral-300 max-w-sm leading-relaxed">
                  Consult Advisr about capital dilution, convertible notes modeling, and seed-round valuation structures. Upgrade to Venture FastTrack to unlock active AI strategic advisory.
                </p>
                <button
                  type="button"
                  onClick={onSubscribeClick}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-lg text-xs cursor-pointer shadow-md transition transform active:scale-95"
                >
                  Unlock AI strategic Mentor
                </button>
              </div>
            )}

            {/* Scrollable messages block */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 min-h-0 bg-neutral-50/30">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed space-y-2 border ${
                      m.role === 'user'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-white text-neutral-800 border-neutral-200 shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-left space-y-2">
                      {m.content.split('\n\n').map((paragraph, pIdx) => {
                        const parts = paragraph.split('**');
                        return (
                          <p key={pIdx} className="leading-relaxed">
                            {parts.map((part, idx) => {
                              return idx % 2 === 1 ? <strong key={idx} className="font-extrabold text-neutral-950 bg-amber-100/50 px-1 rounded">{part}</strong> : part;
                            })}
                          </p>
                        );
                      })}
                    </div>
                    <div className="text-[9px] font-mono mt-1 block text-right text-neutral-400">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isSendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-800" />
                    <span className="text-xs text-neutral-500 font-medium font-sans">Advisr is crafting strategic response...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Float quick template prompt list */}
            <div className="px-5 py-2.5 bg-white border-t border-neutral-200 flex flex-wrap gap-2 shrink-0">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center shrink-0">Quick Prompts:</span>
              <button
                onClick={() => triggerAIResponse("Draft a comprehensive, professional slide-by-slide outline for my seed round pitch deck. Tailor it specifically to my startup profile.")}
                disabled={!isSubscribed}
                className="text-[10px] px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold transition"
              >
                📝 Draft Slide Outline
              </button>
              <button
                onClick={() => triggerAIResponse("How do I model pre-seed dilution so I don't give away too much equity early? Give me exact percentages and safety rules.")}
                disabled={!isSubscribed}
                className="text-[10px] px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold transition"
              >
                📊 Equity Dilution Rules
              </button>
            </div>

            {/* Input Bar Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-200 flex gap-2.5 shrink-0">
              <input
                type="text"
                placeholder="Ask Advisr about valuation multiples, pitch narratives, warm introductions playbook..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isSendingMessage || !isSubscribed}
                className="flex-grow px-4 py-2.5 text-xs border border-neutral-200 rounded-lg bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={isSendingMessage || !chatInput.trim() || !isSubscribed}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg transition disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* SUB-TAB 2: VC MOCK INTERVIEW SIMULATOR */}
        {subTab === 'mock-interview' && (
          <div className="flex-grow overflow-y-auto p-6 space-y-6 flex flex-col md:flex-row gap-6 min-h-0 bg-neutral-50/30">
            {/* Left selector panel */}
            <div className="md:w-2/5 space-y-4">
              <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-800">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Prep Arena
                </div>
                <h3 className="font-bold text-sm text-neutral-800">Tough VC Questions Bank</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Professional VCs test the extremes of your startup. Select an interview question and submit your raw response to get constructive feedback.
                </p>
              </div>

              <div className="space-y-2">
                {INTERVIEW_QUESTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedQuestion(item); setUserAnswerInput(''); setInterviewFeedback(''); }}
                    className={`w-full p-3.5 rounded-lg text-left border text-xs transition block cursor-pointer ${
                      selectedQuestion.id === item.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider font-bold font-mono mb-1 text-neutral-400">
                      {item.category}
                    </div>
                    <div className="font-semibold leading-relaxed truncate">{item.question}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right active playground panel (LOCK OVERLAY for unsubscribed) */}
            <div className="md:w-3/5 space-y-4 flex flex-col justify-between min-h-0 relative">
              
              {!isSubscribed && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col justify-center items-center text-center p-6 space-y-4 z-20 rounded-xl border border-neutral-200 shadow-2xs">
                  <Lock className="w-9 h-9 text-amber-500 animate-pulse" />
                  <h4 className="text-base font-bold text-neutral-800">Mock VC Grading Engine</h4>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                    Submit customized pitches to five challenging founder questions and get rated Needs Work, Good, or Outstanding by Advisr AI.
                  </p>
                  <button
                    type="button"
                    onClick={onSubscribeClick}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-950 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition active:scale-95"
                  >
                    Unlock VC Prep Simulator
                  </button>
                </div>
              )}

              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4 flex-grow">
                {/* Active Question Box */}
                <div className="space-y-1.5 text-left border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-bold font-mono uppercase text-amber-600 tracking-wider">Active Challenge</span>
                  <h4 className="text-sm font-bold text-neutral-900 leading-relaxed">{selectedQuestion.question}</h4>
                  <p className="text-[11px] text-neutral-400 italic">VC Strategy: {selectedQuestion.context}</p>
                </div>

                {/* Answer area */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold font-mono uppercase text-neutral-400">Your Proposed Answer Pitch</label>
                  <textarea
                    placeholder="Type your strategic answer here (be specific, focus on early metrics, team background, or technological barriers)..."
                    value={userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    rows={4}
                    disabled={!isSubscribed}
                    className="w-full p-3 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white leading-relaxed resize-none font-sans"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSubmitMockAnswer}
                    disabled={isSubmittingAnswer || !userAnswerInput.trim() || !isSubscribed}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isSubmittingAnswer ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluating Pitch...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Grade My Response
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic feedback panel */}
              {interviewFeedback && isSubscribed && (
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-inner overflow-y-auto max-h-[35vh]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-bold text-xs text-neutral-800">Advisr's Constructive Grading</h4>
                    </div>
                    <div className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans text-left space-y-2">
                      {interviewFeedback.split('\n\n').map((paragraph, pIdx) => {
                        const parts = paragraph.split('**');
                        return (
                          <p key={pIdx} className="leading-relaxed">
                            {parts.map((part, idx) => {
                              return idx % 2 === 1 ? <strong key={idx} className="font-bold text-neutral-900 bg-amber-50 px-1 rounded">{part}</strong> : part;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: CAPITAL VALUATION CALCULATOR */}
        {subTab === 'valuation' && (
          <div className="flex-grow overflow-y-auto p-6 space-y-6 flex flex-col md:flex-row gap-6 min-h-0 bg-neutral-50/30 text-left">
            {/* Inputs Panel (Remains fully interactive as an engaging trial teaser!) */}
            <div className="md:w-1/2 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4 relative">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-bold text-sm text-neutral-800">Startup Valuation Inputs</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Adjust parameters below to see the math models compute fair pre-money multiplies.</p>
              </div>

              {/* MRR Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase">Monthly Revenue (MRR)</label>
                  <span className="text-xs font-mono font-bold text-neutral-800">${currentMRR.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={currentMRR}
                  onChange={(e) => setCurrentMRR(Number(e.target.value))}
                  className="w-full accent-neutral-800 cursor-pointer h-1 bg-neutral-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                  <span>$0 MRR</span>
                  <span>$50k MRR</span>
                  <span>$100k MRR</span>
                </div>
              </div>

              {/* YoY Growth rate slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase">Year-over-Year Growth</label>
                  <span className="text-xs font-mono font-bold text-neutral-800">{annualGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={annualGrowth}
                  onChange={(e) => setAnnualGrowth(Number(e.target.value))}
                  className="w-full accent-neutral-800 cursor-pointer h-1 bg-neutral-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                  <span>Flat (0%)</span>
                  <span>Healthy (100%)</span>
                  <span>Triple-Triple (300%)</span>
                </div>
              </div>

              {/* Team pedigree selectors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase block">Team Quality Factor</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTeamQuality('solo')}
                    className={`p-2 rounded text-left text-xs border transition cursor-pointer ${
                      teamQuality === 'solo' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    👨‍💻 Solo Founder
                  </button>
                  <button
                    onClick={() => setTeamQuality('cofounders')}
                    className={`p-2 rounded text-left text-xs border transition cursor-pointer ${
                      teamQuality === 'cofounders' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    🤝 Complete Co-founders
                  </button>
                  <button
                    onClick={() => setTeamQuality('experts')}
                    className={`p-2 rounded text-left text-xs border transition cursor-pointer ${
                      teamQuality === 'experts' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    🛡️ Deep Domain Experts
                  </button>
                  <button
                    onClick={() => setTeamQuality('tier1')}
                    className={`p-2 rounded text-left text-xs border transition cursor-pointer ${
                      teamQuality === 'tier1' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    🚀 Tier-1 Pedigree / Prev Exit
                  </button>
                </div>
              </div>

              {/* Market size and defensibility factors */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase block">Total Market (TAM)</label>
                  <select
                    value={marketSizeGrade}
                    onChange={(e) => setMarketSizeGrade(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded p-1.5 cursor-pointer focus:outline-none"
                  >
                    <option value="niche">Niche / Fragmented (&lt;$1B)</option>
                    <option value="healthy">Healthy Growing ($1B-$5B)</option>
                    <option value="massive">Massive Blue Ocean (&gt;$10B)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase block">Defensibility Moat</label>
                  <select
                    value={techDefensibility}
                    onChange={(e) => setTechDefensibility(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded p-1.5 cursor-pointer focus:outline-none"
                  >
                    <option value="low">Low Moat (Easy copy)</option>
                    <option value="medium">Medium Moat (Data advantage)</option>
                    <option value="high">High Moat (Proprietary IP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Output Panel displaying valuation (LOCK OVERLAY for unsubscribed) */}
            <div className="md:w-1/2 space-y-4 flex flex-col justify-between relative">
              
              {!isSubscribed && (
                <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 space-y-3 z-20 rounded-xl">
                  <Lock className="w-8 h-8 text-amber-500 animate-pulse" />
                  <h4 className="text-base font-bold text-white">Reveal Fair Valuation Range</h4>
                  <p className="text-xs text-neutral-300 max-w-xs leading-relaxed">
                    Unlock dynamic pre-seed, seed, and Series A valuation range multiples based on real ARR runrates, defensibility indexes, and market TAM parameters.
                  </p>
                  <button
                    type="button"
                    onClick={onSubscribeClick}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-lg text-xs cursor-pointer shadow-md transition"
                  >
                    Unlock Valuation Calculator
                  </button>
                </div>
              )}

              {/* Wrapped Output Elements, blurred if not subscribed */}
              <div className={`space-y-4 flex flex-col justify-between h-full ${!isSubscribed ? 'blur-[5px] select-none pointer-events-none' : ''}`}>
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-xl p-6 border border-neutral-800 shadow-md space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono uppercase text-emerald-400 tracking-wider">Projected Venture Valuation</span>
                    <h4 className="text-3xl font-extrabold text-white font-mono mt-1">
                      {isSubscribed ? `${calculatedValuation.low} - ${calculatedValuation.high}` : "$?,???,??? - $?,???,???"}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-medium">Estimated Seed/Series A Fair Pre-Money Range</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">Implied Multiplier</span>
                      <strong className="text-base text-neutral-100 font-mono">{calculatedValuation.multiple}x ARR</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">ARR Runrate</span>
                      <strong className="text-base text-neutral-100 font-mono">${(currentMRR * 12).toLocaleString()} / yr</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
                    {calculatedValuation.narrative}
                  </div>
                </div>

                {/* Valuation strategy tips */}
                <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl space-y-2.5">
                  <h4 className="text-xs font-bold font-mono uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Valuation Playbook
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-amber-500 shrink-0 font-bold">•</span>
                      <span><strong>Avoid pricing your own seed round:</strong> Let lead VCs price it. State your target range, but emphasize that the market decides.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 shrink-0 font-bold">•</span>
                      <span><strong>Optimize dilution:</strong> Secure 18-24 months of operational runway by selling 15% to 20% of your company during the round.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
