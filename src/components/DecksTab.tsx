import React, { useState, useMemo } from 'react';
import { PITCH_DECKS } from '../data/decks';
import { PitchDeck } from '../types';
import { 
  Search, Filter, BookOpen, ChevronLeft, ChevronRight, Award, 
  Flame, Lightbulb, ExternalLink, MessageSquare, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DecksTabProps {
  onAskMentor: (prompt: string) => void;
  isSubscribed: boolean;
  onSubscribeClick: () => void;
  startupProfile: {
    name: string;
    pitch: string;
    sector: string;
    stage: string;
    traction: string;
  };
}

export default function DecksTab({ onAskMentor, isSubscribed, onSubscribeClick, startupProfile }: DecksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [activeDeck, setActiveDeck] = useState<PitchDeck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Extract unique industries for filter
  const industries = useMemo(() => {
    const set = new Set<string>();
    PITCH_DECKS.forEach(d => {
      if (d.industry) {
        const mainInd = d.industry.split(' & ')[0];
        set.add(mainInd);
      }
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filter Decks
  const filteredDecks = useMemo(() => {
    return PITCH_DECKS.filter(deck => {
      const matchesSearch = 
        deck.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRound = selectedRound === 'All' || deck.round === selectedRound;
      const matchesIndustry = selectedIndustry === 'All' || deck.industry.includes(selectedIndustry);

      return matchesSearch && matchesRound && matchesIndustry;
    });
  }, [searchQuery, selectedRound, selectedIndustry]);

  const handleOpenDeck = (deck: PitchDeck) => {
    setActiveDeck(deck);
    setActiveSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (activeDeck && activeSlideIndex < activeDeck.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6 text-left" id="decks-tab-container">
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900">100 Unicorn Pitch Decks</h2>
          <p className="text-xs text-neutral-500 mt-1">Study the exact slide layouts and fundraising lessons from startups that raised $1B+.</p>
        </div>
        {!isSubscribed && (
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-800 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Preview Mode: Slide 1 is unlocked, Slides 2+ require Premium</span>
          </div>
        )}
      </div>

      {/* Grid Controls (Search & Filter) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search company or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
          />
        </div>

        {/* Filter Round */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
          >
            <option value="All">All Funding Rounds</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
          </select>
        </div>

        {/* Filter Industry */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
          >
            <option value="All">All Industries</option>
            {industries.filter(ind => ind !== 'All').map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pitch Deck Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map(deck => (
          <div 
            key={deck.id}
            className="bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 shadow-3xs hover:shadow-2xs transition flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Lock Ribbon on Card for unsubscribed users */}
            {!isSubscribed && (
              <div className="absolute top-3 right-3 z-10 bg-neutral-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span>Locked Gated</span>
              </div>
            )}

            <div className="p-5 space-y-4 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-sm group-hover:text-amber-600 transition">{deck.company}</h4>
                  <span className="inline-block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider font-mono mt-0.5">{deck.industry}</span>
                </div>
                <div className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[9px] font-mono rounded font-bold">
                  {deck.round}
                </div>
              </div>

              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{deck.description}</p>

              {/* Amount and Slides stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs font-mono">
                <div>
                  <span className="block text-[9px] text-neutral-400 uppercase">Raised</span>
                  <strong className="text-neutral-800">{deck.amountRaised}</strong>
                </div>
                <div>
                  <span className="block text-[9px] text-neutral-400 uppercase">Analysis</span>
                  <strong className="text-neutral-800">{deck.slidesCount} Slides</strong>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-1">
              <button
                onClick={() => handleOpenDeck(deck)}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Analyze Slides</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredDecks.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-400 bg-neutral-100/50 rounded-xl border border-dashed border-neutral-200">
            No pitch decks match your search filters.
          </div>
        )}
      </div>

      {/* Slide Analysis Overlay Panel */}
      <AnimatePresence>
        {activeDeck && (
          <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden border border-neutral-200 text-left"
            >
              {/* Left Column: Slide Deck Simulator */}
              <div className="md:w-3/5 bg-neutral-950 text-white flex flex-col justify-between p-6 relative select-none">
                {/* Simulated Slate Frame Header */}
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono border-b border-neutral-800 pb-3">
                  <span>{activeDeck.company} - HISTORICAL SLIDE {activeSlideIndex + 1}/{activeDeck.slides.length}</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px]">{activeDeck.round} Round</span>
                </div>

                {/* Main Visual Slide Sandbox */}
                <div className="my-8 flex-grow flex flex-col justify-center items-center text-center px-4 relative">
                  
                  {/* LOCK SCREEN OVERLAY for unsubscribed users on slides >= 1 (Slide 2+) */}
                  {activeSlideIndex > 0 && !isSubscribed ? (
                    <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 space-y-4 z-20 rounded-xl">
                      <Lock className="w-8 h-8 text-amber-500 animate-pulse" />
                      <h4 className="text-base font-bold text-white">Unlock Slide {activeSlideIndex + 1} & More</h4>
                      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                        You are browsing in free mode. Upgrade to Founder Premium to unlock all slide analysis, lessons, and AI features.
                      </p>
                      <button
                        onClick={onSubscribeClick}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-lg text-xs cursor-pointer shadow-md transition transform active:scale-95"
                      >
                        Upgrade to Unlock
                      </button>
                    </div>
                  ) : null}

                  <div className="space-y-4 max-w-lg">
                    {/* Simulated Slide Canvas */}
                    <div className="p-6 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/60 shadow-inner space-y-4">
                      <div className="inline-flex h-2 w-12 bg-amber-500 rounded-full mx-auto" />
                      <h4 className="text-xl font-bold tracking-tight text-white font-sans">
                        {activeDeck.slides[activeSlideIndex]?.title || "Slide Title"}
                      </h4>
                      <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                        {activeDeck.slides[activeSlideIndex]?.description || "Slide Description placeholder representing raw historic bullet points and diagrams."}
                      </p>
                    </div>
                    {/* Analyst Highlight Tag */}
                    {activeDeck.slides[activeSlideIndex]?.highlight && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 text-left max-w-md mx-auto">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span><strong>Analyst Commentary:</strong> {activeDeck.slides[activeSlideIndex].highlight}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide Controls Footer */}
                <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevSlide}
                      disabled={activeSlideIndex === 0}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      disabled={activeSlideIndex === activeDeck.slides.length - 1}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Slide {activeSlideIndex + 1} of {activeDeck.slides.length}
                  </span>
                </div>
              </div>

              {/* Right Column: Key Details & Strategic Breakdowns */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-neutral-50 border-l border-neutral-200">
                <div className="space-y-6">
                  {/* Title Info */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">{activeDeck.company}</h3>
                      <p className="text-xs text-neutral-400 mt-1 font-mono uppercase tracking-wider font-semibold">{activeDeck.industry}</p>
                    </div>
                    <button
                      onClick={() => setActiveDeck(null)}
                      className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 rounded-lg text-sm font-bold transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Financial Quick Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 font-mono">Amount Raised</div>
                      <div className="text-lg font-bold text-neutral-800 font-mono mt-0.5">{activeDeck.amountRaised}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 font-mono">Est. Valuation</div>
                      <div className="text-lg font-bold text-neutral-800 font-mono mt-0.5">{activeDeck.valuation}</div>
                    </div>
                  </div>

                  {/* Strategic Takeaway Card */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs font-mono uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-600" /> Core Pitch Formula
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                      {activeDeck.keyTakeaway}
                    </p>
                  </div>

                  {/* Bulleted Lessons Learned */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider">Strategic Lessons for Founders</h4>
                    <ul className="space-y-2 relative">
                      {activeDeck.lessonsLearned.map((lesson, idx) => {
                        const isLessonLocked = idx > 0 && !isSubscribed;
                        return (
                          <li 
                            key={idx} 
                            className={`flex gap-2.5 text-xs text-neutral-600 leading-relaxed text-left transition ${
                              isLessonLocked ? 'blur-[3px] select-none pointer-events-none' : ''
                            }`}
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{isLessonLocked ? "This high-value strategic lesson is locked under Free Tier. Subscribe to view." : lesson}</span>
                          </li>
                        );
                      })}
                      {!isSubscribed && (
                        <div className="absolute inset-x-0 bottom-0 top-10 bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent flex flex-col justify-end items-center pb-2">
                          <button
                            onClick={onSubscribeClick}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-950 text-white text-[9px] font-bold rounded-md shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Lock className="w-2.5 h-2.5 text-amber-500" /> Reveal Remaining Lessons
                          </button>
                        </div>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-6 border-t border-neutral-200 flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => {
                      if (!isSubscribed) {
                        onSubscribeClick();
                        return;
                      }
                      onAskMentor(`Compare my startup (${startupProfile.name}) raised stage (${startupProfile.stage}) with the historical ${activeDeck.company} pitch deck. Outline how my pitch can emulate their business model slide.`);
                    }}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    <span>Ask Mentor to Compare with my Startup</span>
                  </button>
                  {activeDeck.deckUrl && (
                    <button
                      onClick={() => {
                        if (!isSubscribed) {
                          onSubscribeClick();
                          return;
                        }
                        window.open(activeDeck.deckUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="py-2 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs text-neutral-600 font-semibold text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      {!isSubscribed ? <Lock className="w-3 h-3 text-amber-500" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      <span>View Original Slides <span className="text-[10px] text-neutral-400 font-mono">(Slideshare)</span></span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
