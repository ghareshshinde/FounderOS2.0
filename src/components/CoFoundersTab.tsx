import React, { useState, useEffect, useMemo } from 'react';
import { CoFounderPost } from '../types';
import { 
  Search, Users, RefreshCw, Send, Sparkles, ExternalLink, 
  Bookmark, BookmarkCheck, Check, Clipboard, Lock, Building, 
  MapPin, DollarSign, Filter, Radio, ShieldCheck, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoFoundersTabProps {
  startupProfile: {
    name: string;
    pitch: string;
    sector: string;
    stage: string;
    traction: string;
  };
  isSubscribed: boolean;
  onSubscribeClick: () => void;
}

const DEFAULT_POSTS: CoFounderPost[] = [
  {
    id: "cf-1",
    authorName: "Alexandre Vance",
    authorTitle: "Ex-Stripe Staff Engineer & Founder @ Novaflow",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=Novaflow%20growth%20co-founder",
    roleNeeded: "Growth / Marketing",
    startupName: "Novaflow AI",
    sector: "AI / ML",
    location: "San Francisco, CA",
    equityOffered: "25% - 40%",
    postExcerpt: "🚀 Looking for a Growth/CMO Co-founder! We just closed $600k pre-seed for Novaflow (autonomous API agent testing). I handle all backend & LLM architecture. Need a co-founder with B2B SaaS GTM experience to drive enterprise pilots.",
    postedTimeAgo: "2 hours ago",
    verifiedPost: true,
    tags: ["GenAI", "B2B SaaS", "Developer Tools", "Pre-Seed"]
  },
  {
    id: "cf-2",
    authorName: "Dr. Elena Rostova",
    authorTitle: "Stanford Bio-Design Postdoc & CEO @ MedPulse",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=MedPulse%20technical%20co-founder",
    roleNeeded: "Technical (CTO)",
    startupName: "MedPulse Health",
    sector: "HealthTech",
    location: "Boston, MA / Remote",
    equityOffered: "30% - 50%",
    postExcerpt: "Seeking a Full-Stack / AI Technical Co-founder (CTO)! We are building predictive ICU patient monitoring software validated with 3 hospitals. Looking for someone strong in PyTorch, HIPAA compliance, and real-time streaming architectures.",
    postedTimeAgo: "5 hours ago",
    verifiedPost: true,
    tags: ["HealthTech", "AI/ML", "HIPAA", "Co-Founder Wanted"]
  },
  {
    id: "cf-3",
    authorName: "Marcus Thorne",
    authorTitle: "Former VP of Product @ Robinhood & FinTech Founder",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=VaultPay%20co-founder%20fintech",
    roleNeeded: "Technical (CTO)",
    startupName: "VaultPay Protocol",
    sector: "FinTech",
    location: "New York, NY",
    equityOffered: "20% - 35%",
    postExcerpt: "Searching for a Lead Technical Co-founder for an ultra-fast cross-border settlement engine. Have $1.2M commitment soft-circled from top angel investors. Looking for a high-velocity engineer proficient in Rust/Go and fintech rails.",
    postedTimeAgo: "1 day ago",
    verifiedPost: true,
    tags: ["FinTech", "Payments", "Rust", "Seed Stage"]
  },
  {
    id: "cf-4",
    authorName: "Sarah Chen",
    authorTitle: "Serial Entrepreneur | Ex-YC W22 Founder",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=SupplyPulse%20sales%20co-founder",
    roleNeeded: "Sales / Ops",
    startupName: "SupplyPulse",
    sector: "Logistics",
    location: "Remote / Austin, TX",
    equityOffered: "15% - 30%",
    postExcerpt: "Looking for an Enterprise Sales Co-founder to join SupplyPulse! We automate supply chain exception workflows using LLMs. Product is fully built with 4 paying pilot customers. Need a partner to scale outreach and close Fortune 500 contracts.",
    postedTimeAgo: "1 day ago",
    verifiedPost: true,
    tags: ["Supply Chain", "B2B Sales", "YC Alum", "Logistics"]
  },
  {
    id: "cf-5",
    authorName: "David Miller",
    authorTitle: "Head of AI Research @ Stealth Startup",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=Aura%20Creative%20Studio%20co-founder",
    roleNeeded: "Product (CPO)",
    startupName: "Aura Creative Studio",
    sector: "AI / ML",
    location: "London, UK / Remote",
    equityOffered: "25% - 45%",
    postExcerpt: "Seeking a Product & Design Co-founder! Building generative 3D asset pipeline for game studios. Have baseline model trained on 100k assets. Need a Product CPO obsessed with UX, creative tools, and community building.",
    postedTimeAgo: "2 days ago",
    verifiedPost: true,
    tags: ["3D AI", "Gaming", "Product Design", "London Startup"]
  },
  {
    id: "cf-6",
    authorName: "Priya Sharma",
    authorTitle: "Ex-Google AI Lead & Founder @ EduBot",
    linkedinUrl: "https://www.linkedin.com/search/results/content/?keywords=EduBot%20growth%20co-founder",
    roleNeeded: "Growth / Marketing",
    startupName: "EduBot Learning",
    sector: "EdTech",
    location: "San Francisco, CA / Remote",
    equityOffered: "20% - 40%",
    postExcerpt: "Looking for a Growth & Marketing Co-founder to scale personalized AI tutor app currently used by 12,000 students. Seeking someone who understands viral organic growth, TikTok/K-12 marketing, and community loops.",
    postedTimeAgo: "2 days ago",
    verifiedPost: true,
    tags: ["EdTech", "Consumer AI", "Growth", "Community"]
  }
];

export default function CoFoundersTab({ startupProfile, isSubscribed, onSubscribeClick }: CoFoundersTabProps) {
  // Feed items state
  const [posts, setPosts] = useState<CoFounderPost[]>(DEFAULT_POSTS);
  const [isScraping, setIsScraping] = useState(false);
  const [lastScrapedTime, setLastScrapedTime] = useState<string>("Just now");

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // DM Drafter state
  const [activeDraftCandidate, setActiveDraftCandidate] = useState<CoFounderPost | null>(null);
  const [draftedDmText, setDraftedDmText] = useState('');
  const [isDraftingDm, setIsDraftingDm] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);

  // Saved Candidates CRM
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(() => {
    const local = localStorage.getItem('saved_cofounder_candidates');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('saved_cofounder_candidates', JSON.stringify(savedCandidateIds));
  }, [savedCandidateIds]);

  const toggleSaveCandidate = (id: string) => {
    if (savedCandidateIds.includes(id)) {
      setSavedCandidateIds(prev => prev.filter(item => item !== id));
    } else {
      setSavedCandidateIds(prev => [...prev, id]);
    }
  };

  // Live Scrape trigger
  const handleScrapeLiveFeed = async () => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }

    setIsScraping(true);
    try {
      const response = await fetch('/api/cofounders/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleNeeded: selectedRole,
          sector: selectedSector,
          location: selectedLocation,
          searchQuery
        })
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
        setLastScrapedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error("Scrape error:", err);
    } finally {
      setIsScraping(false);
    }
  };

  // Trigger DM Drafting
  const handleTriggerDraftDm = async (candidate: CoFounderPost) => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }

    setActiveDraftCandidate(candidate);
    setIsDraftingDm(true);
    setDraftedDmText('');
    setCopiedDm(false);

    try {
      const response = await fetch('/api/cofounders/draft-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.authorName,
          candidateTitle: candidate.authorTitle,
          postExcerpt: candidate.postExcerpt,
          roleNeeded: candidate.roleNeeded,
          startupName: startupProfile.name || 'My Startup',
          startupPitch: startupProfile.pitch || 'a fast-growing tech platform'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setDraftedDmText(data.dmText);
      } else {
        setDraftedDmText(`Error generating message: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setDraftedDmText(`Connection error: ${err.message || 'Could not connect'}`);
    } finally {
      setIsDraftingDm(false);
    }
  };

  const handleCopyDmText = () => {
    navigator.clipboard.writeText(draftedDmText);
    setCopiedDm(true);
    setTimeout(() => setCopiedDm(false), 2000);
  };

  // Filtered post list
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.postExcerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'All' || post.roleNeeded === selectedRole;
      const matchesSector = selectedSector === 'All' || post.sector === selectedSector;
      const matchesLocation = selectedLocation === 'All' || post.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesRole && matchesSector && matchesLocation;
    });
  }, [posts, searchQuery, selectedRole, selectedSector, selectedLocation]);

  return (
    <div className="space-y-6 text-left animate-fade-in" id="cofounders-tab-container">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-6 rounded-xl border border-neutral-800 shadow-md flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Radio className="w-3 h-3 animate-pulse text-amber-400" /> Live LinkedIn Co-Founder Scraper
          </div>
          <h2 className="text-xl font-bold tracking-tight">LinkedIn Co-Founder Live Feed</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Real-time feed of entrepreneurs, engineers, and executives actively posting on LinkedIn looking for co-founders.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase font-mono text-neutral-500">Live Status</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Feed Active
            </div>
          </div>
          <button
            onClick={handleScrapeLiveFeed}
            disabled={isScraping}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition transform active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Scraping LinkedIn...' : 'Refresh Live Feed'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search posts by founder, startup name, skill, LLM, YC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-neutral-400 font-mono">Last update: {lastScrapedTime}</span>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-neutral-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Role Sought</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 cursor-pointer focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Technical (CTO)">Technical (CTO)</option>
              <option value="Growth / Marketing">Growth / Marketing</option>
              <option value="Product (CPO)">Product (CPO)</option>
              <option value="Domain / CEO">Domain / CEO</option>
              <option value="Design / UX">Design / UX</option>
              <option value="Sales / Ops">Sales / Ops</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Sector Focus</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 cursor-pointer focus:outline-none"
            >
              <option value="All">All Sectors</option>
              <option value="AI / ML">AI / ML</option>
              <option value="HealthTech">HealthTech</option>
              <option value="FinTech">FinTech</option>
              <option value="Logistics">Logistics</option>
              <option value="SaaS">SaaS</option>
              <option value="EdTech">EdTech</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 cursor-pointer focus:outline-none"
            >
              <option value="All">All Locations</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="Boston">Boston, MA</option>
              <option value="New York">New York, NY</option>
              <option value="London">London, UK</option>
              <option value="Austin">Austin, TX</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Posts Grid and DM Drafter layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-xl space-y-2">
              <Users className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">No co-founder posts match your filters.</p>
              <p className="text-xs text-neutral-400">Try resetting filters or click "Refresh Live Feed" to trigger a fresh scrape.</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isSaved = savedCandidateIds.includes(post.id);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs hover:shadow-sm transition-all space-y-3.5 relative"
                >
                  {/* Top Bar: Author profile & time */}
                  <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs font-mono">
                        {post.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-neutral-900">{post.authorName}</h3>
                          {post.verifiedPost && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{post.authorTitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono shrink-0">{post.postedTimeAgo}</span>
                  </div>

                  {/* Role Seeking & Details Strip */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-amber-500/10 text-amber-800 border border-amber-500/20 uppercase tracking-wider">
                      Seeking: {post.roleNeeded}
                    </span>
                    <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {post.startupName} ({post.sector})
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                      <MapPin className="w-3 h-3 text-neutral-400" /> {post.location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                      <DollarSign className="w-3 h-3 text-emerald-600" /> Equity: {post.equityOffered}
                    </span>
                  </div>

                  {/* Post Content Excerpt */}
                  <p className="text-xs text-neutral-700 leading-relaxed font-sans bg-neutral-50/60 p-3 rounded-lg border border-neutral-100">
                    "{post.postExcerpt}"
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(t => (
                      <span key={t} className="text-[9px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveCandidate(post.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                          isSaved 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-neutral-400" />}
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!isSubscribed) {
                            onSubscribeClick();
                            return;
                          }
                          window.open(post.linkedinUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        {!isSubscribed ? <Lock className="w-3 h-3 text-amber-500" /> : <ExternalLink className="w-3 h-3 text-neutral-500" />}
                        <span>View on LinkedIn</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleTriggerDraftDm(post)}
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Draft Outreach DM</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right 1 Col: AI DM Outreach Generator Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-amber-500" />
                <span>AI LinkedIn Outreach Assistant</span>
              </div>
            </div>

            {activeDraftCandidate && isSubscribed ? (
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-neutral-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Target Candidate: {activeDraftCandidate.authorName}
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">Seeking: {activeDraftCandidate.roleNeeded} @ {activeDraftCandidate.startupName}</p>
                </div>

                {isDraftingDm ? (
                  <div className="py-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-neutral-800" />
                    <p className="text-xs font-medium">Crafting customized LinkedIn DM...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={draftedDmText}
                      onChange={(e) => setDraftedDmText(e.target.value)}
                      rows={7}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none font-mono leading-relaxed"
                    />

                    <button
                      onClick={handleCopyDmText}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                    >
                      {copiedDm ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied DM to Clipboard!
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" /> Copy Message Text
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="text-xs font-medium">Select any candidate to draft DM</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed px-2">
                  Click **"Draft Outreach DM"** on any post to generate a personalized connection message tailored to their post.
                </p>
              </div>
            )}
          </div>

          {/* Saved Candidates Pipeline Widget */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h3 className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" /> Saved Candidates ({savedCandidateIds.length})
              </h3>
            </div>

            {savedCandidateIds.length === 0 ? (
              <p className="text-[11px] text-neutral-400 text-center py-4">No candidates saved yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {posts.filter(p => savedCandidateIds.includes(p.id)).map(p => (
                  <div key={p.id} className="p-2.5 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neutral-900 text-[11px]">{p.authorName}</div>
                      <div className="text-[10px] text-neutral-500">{p.roleNeeded}</div>
                    </div>
                    <button
                      onClick={() => toggleSaveCandidate(p.id)}
                      className="text-[10px] text-neutral-400 hover:text-red-500 font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
