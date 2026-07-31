import React, { useState, useMemo, useEffect } from 'react';
import { getInvestors } from '../data/investors';
import { Investor, SavedLead } from '../types';
import { 
  Search, Filter, Bookmark, BookmarkCheck, Mail, Globe, 
  MapPin, DollarSign, Building, Download, Clipboard, RefreshCw, 
  Send, Sparkles, Check, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvestorsTabProps {
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

export default function InvestorsTab({ startupProfile, isSubscribed, onSubscribeClick }: InvestorsTabProps) {
  // All 5,000 generated investors
  const investorsList = useMemo(() => getInvestors(), []);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCheckSize, setSelectedCheckSize] = useState('All');

  // Pagination state for 5,000 items (Slice & render 20 items at a time to maintain 120 FPS performance)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // CRM/Saved leads state (Stored in localStorage)
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>(() => {
    const local = localStorage.getItem('fundraising_saved_leads');
    return local ? JSON.parse(local) : [];
  });

  // active cold email drafting state
  const [draftingInvestor, setDraftingInvestor] = useState<Investor | null>(null);
  const [draftedEmail, setDraftedEmail] = useState('');
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Sync saved leads to localStorage
  useEffect(() => {
    localStorage.setItem('fundraising_saved_leads', JSON.stringify(savedLeads));
  }, [savedLeads]);

  // Derive unique filter lists
  const sectorsList = useMemo(() => {
    return ['All', 'SaaS', 'FinTech', 'HealthTech', 'AI / ML', 'Consumer', 'Web3 / Crypto', 'DeepTech', 'EdTech', 'Cybersecurity', 'Logistics', 'ClimateTech'];
  }, []);

  const locationsList = useMemo(() => {
    return ['All', 'Silicon Valley', 'New York City', 'London', 'Berlin', 'Singapore', 'San Francisco', 'Boston', 'Austin', 'Los Angeles', 'Toronto', 'Tokyo', 'Sydney', 'Paris', 'Remote'];
  }, []);

  // Filter 5,000+ investors list
  const filteredInvestors = useMemo(() => {
    return investorsList.filter(inv => {
      // Search matches firm, investor name, location, website
      const matchesSearch = 
        inv.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.website.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = selectedStage === 'All' || inv.stageFocus.includes(selectedStage);
      const matchesSector = selectedSector === 'All' || inv.sectors.includes(selectedSector);
      const matchesLocation = selectedLocation === 'All' || inv.location === selectedLocation;
      const matchesType = selectedType === 'All' || inv.type === selectedType;
      const matchesCheckSize = selectedCheckSize === 'All' || inv.checkSize === selectedCheckSize;

      return matchesSearch && matchesStage && matchesSector && matchesLocation && matchesType && matchesCheckSize;
    });
  }, [investorsList, searchQuery, selectedStage, selectedSector, selectedLocation, selectedType, selectedCheckSize]);

  // Slice list for pagination
  const paginatedInvestors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvestors.slice(0, startIndex + itemsPerPage);
  }, [filteredInvestors, currentPage]);

  const hasMore = paginatedInvestors.length < filteredInvestors.length;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStage, selectedSector, selectedLocation, selectedType, selectedCheckSize]);

  // Lead Actions
  const isLeadSaved = (investorId: string) => {
    return savedLeads.some(lead => lead.investorId === investorId);
  };

  const toggleSaveLead = (investorId: string) => {
    if (isLeadSaved(investorId)) {
      setSavedLeads(prev => prev.filter(lead => lead.investorId !== investorId));
    } else {
      const newLead: SavedLead = {
        id: `lead-${Date.now()}`,
        investorId,
        status: 'Not Contacted',
        notes: '',
        dateAdded: new Date().toLocaleDateString()
      };
      setSavedLeads(prev => [...prev, newLead]);
    }
  };

  const handleUpdateLeadStatus = (leadId: string, status: SavedLead['status']) => {
    setSavedLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status } : lead));
  };

  const handleUpdateLeadNotes = (leadId: string, notes: string) => {
    setSavedLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, notes } : lead));
  };

  // Saved lead entities with investor details included
  const savedLeadsWithDetails = useMemo(() => {
    return savedLeads.map(lead => {
      const investor = investorsList.find(inv => inv.id === lead.investorId);
      return {
        ...lead,
        investor
      };
    }).filter(lead => lead.investor !== undefined) as (SavedLead & { investor: Investor })[];
  }, [savedLeads, investorsList]);

  // CSV Exporter for Pipeline or Filtered list
  const handleExportCSV = (exportType: 'pipeline' | 'filtered') => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }

    let dataToExport = [];
    if (exportType === 'pipeline') {
      dataToExport = savedLeadsWithDetails.map(l => ({
        Name: l.investor.name,
        Firm: l.investor.firm,
        Type: l.investor.type,
        StageFocus: l.investor.stageFocus.join('; '),
        Sectors: l.investor.sectors.join('; '),
        CheckSize: l.investor.checkSize,
        Location: l.investor.location,
        Email: l.investor.email,
        Website: l.investor.website,
        Status: l.status,
        MyNotes: l.notes,
        DateAdded: l.dateAdded
      }));
    } else {
      dataToExport = filteredInvestors.slice(0, 500).map(inv => ({
        Name: inv.name,
        Firm: inv.firm,
        Type: inv.type,
        StageFocus: inv.stageFocus.join('; '),
        Sectors: inv.sectors.join('; '),
        CheckSize: inv.checkSize,
        Location: inv.location,
        Email: inv.email,
        Website: inv.website
      }));
    }

    if (dataToExport.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Generate CSV content
    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    
    // Download Trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportType === 'pipeline' ? "Fundraising_Leads_Pipeline.csv" : "Investors_Database_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Cold Email Drafter
  const handleTriggerDraftEmail = async (investor: Investor) => {
    if (!isSubscribed) {
      onSubscribeClick();
      return;
    }

    setDraftingInvestor(investor);
    setIsDraftingEmail(true);
    setDraftedEmail('');
    setCopiedDraft(false);

    try {
      const response = await fetch('/api/mentor/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorName: investor.name,
          investorFirm: investor.firm,
          investorSectors: investor.sectors,
          startupName: startupProfile.name || 'My Startup',
          startupPitch: startupProfile.pitch || 'A revolutionary high-growth platform.',
          stage: startupProfile.stage || 'Seed',
          traction: startupProfile.traction || 'Private beta with exciting early metrics.'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setDraftedEmail(data.email);
      } else {
        setDraftedEmail(`Error drafting email: ${data.error || 'Unknown error occurred.'}`);
      }
    } catch (err: any) {
      setDraftedEmail(`Network error: ${err.message || 'Could not connect to service.'}`);
    } finally {
      setIsDraftingEmail(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draftedEmail);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left animate-fade-in" id="investors-tab-container">
      {/* LEFT 2 COLUMNS: Investor Directory */}
      <div className="lg:col-span-2 space-y-6">
        {/* Statistics and Title */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-xl p-6 border border-neutral-800 shadow-md flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Active Investors Directory</h2>
            <p className="text-xs text-neutral-400">Search and qualify over 5,000 real-world & synthetic VCs, Angels, and Accelerators.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-amber-500 font-mono">5,000</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">Listed Profiles</div>
            </div>
            <div className="text-center border-l border-neutral-800 pl-6">
              <div className="text-xl font-bold text-emerald-500 font-mono">{filteredInvestors.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">Filtered Matches</div>
            </div>
          </div>
        </div>

        {/* Powerful Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3.5">
          {/* Main search and dynamic actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search 5,000 investors by partner, firm, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition"
              />
            </div>
            <button
              onClick={() => handleExportCSV('filtered')}
              className="px-3.5 py-2 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer shadow-3xs"
            >
              {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Download className="w-3.5 h-3.5" />}
              <span>Export Filtered List <span className="text-[10px] text-neutral-400 font-normal">(Max 500)</span></span>
            </button>
          </div>

          {/* Sliced Categorical Filter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-neutral-100">
            {/* Stage */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Stage Focus</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 cursor-pointer focus:outline-none"
              >
                <option value="All">All Stages</option>
                <option value="Pre-seed">Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Growth">Growth</option>
              </select>
            </div>

            {/* Sector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sector Focus</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 cursor-pointer focus:outline-none"
              >
                {sectorsList.map(sec => (
                  <option key={sec} value={sec}>{sec === 'All' ? 'All Sectors' : sec}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 cursor-pointer focus:outline-none"
              >
                {locationsList.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Investor Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 cursor-pointer focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="VC Firm">VC Firm</option>
                <option value="Angel Network">Angel Network</option>
                <option value="CVC">CVC (Corporate)</option>
                <option value="Accelerator">Accelerator</option>
                <option value="Family Office">Family Office</option>
              </select>
            </div>

            {/* Check Size */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Check Size</label>
              <select
                value={selectedCheckSize}
                onChange={(e) => setSelectedCheckSize(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 cursor-pointer focus:outline-none"
              >
                <option value="All">All Check Sizes</option>
                <option value="$50k - $250k">$50k - $250k</option>
                <option value="$250k - $1M">$250k - $1M</option>
                <option value="$1M - $5M">$1M - $5M</option>
                <option value="$5M - $15M">$5M - $15M</option>
                <option value="$15M - $50M">$15M - $50M</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main List Rendering */}
        <div className="space-y-4">
          {paginatedInvestors.length === 0 ? (
            <div className="py-20 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl bg-white">
              <Building className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-medium">No investors match your filter query.</p>
              <p className="text-xs text-neutral-400 mt-1">Try relaxing some search keywords or select boxes.</p>
            </div>
          ) : (
            paginatedInvestors.map((inv) => {
              const isSaved = isLeadSaved(inv.id);
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="space-y-3 flex-grow max-w-xl">
                    {/* Header line: Partner & Firm */}
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="text-base font-bold text-neutral-900">{inv.name}</h3>
                      <span className="text-xs font-semibold text-neutral-500">{inv.firm}</span>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-200 text-neutral-700">
                        {inv.type}
                      </span>
                    </div>

                    {/* Metadata strip containing masked Email for unsubscribed */}
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" /> {inv.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 shrink-0 text-neutral-400" /> Typical Check: <strong className="font-semibold font-mono text-neutral-800">{inv.checkSize}</strong>
                      </span>
                      
                      {/* Gated Obscured Email block */}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-neutral-400" /> Contact Email: {isSubscribed ? (
                          <strong className="font-semibold text-neutral-800 font-mono text-[11px]">{inv.email}</strong>
                        ) : (
                          <span 
                            onClick={onSubscribeClick}
                            className="font-bold text-amber-600 font-mono text-[10px] select-none cursor-pointer flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10 hover:bg-amber-500/20"
                            title="Subscribe to reveal contact"
                          >
                            <Lock className="w-2.5 h-2.5 text-amber-600" /> Obscured (Premium Only)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Tags Strip */}
                    <div className="flex flex-wrap gap-1.5">
                      {inv.stageFocus.map(st => (
                        <span key={st} className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-700 rounded border border-neutral-200/50">
                          {st}
                        </span>
                      ))}
                      {inv.sectors.map(sec => (
                        <span key={sec} className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/10 rounded">
                          {sec}
                        </span>
                      ))}
                    </div>

                    {/* Brief Note */}
                    {inv.notes && (
                      <p className="text-xs text-neutral-600 border-l-2 border-neutral-200 pl-2 leading-relaxed">
                        {inv.notes}
                      </p>
                    )}

                    {/* Key Investments Portfolio */}
                    {inv.portfolio && inv.portfolio.length > 0 && (
                      <div className="text-[11px] text-neutral-400 font-medium">
                        Featured Portfolio: <span className="font-semibold text-neutral-600 font-mono text-[10px]">{inv.portfolio.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex md:flex-col gap-2.5 justify-end items-center md:items-stretch w-full md:w-36 pt-3 md:pt-0 border-t border-neutral-100 md:border-t-0 shrink-0">
                    <button
                      onClick={() => toggleSaveLead(inv.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer border transition ${
                        isSaved 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50' 
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> Saved to Board
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-neutral-400" /> Save Lead
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleTriggerDraftEmail(inv)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                      <span>Draft Cold Email</span>
                    </button>

                    {inv.website && (
                      <button
                        onClick={() => {
                          if (!isSubscribed) {
                            onSubscribeClick();
                            return;
                          }
                          window.open(inv.website, '_blank', 'noopener,noreferrer');
                        }}
                        className="py-1 border border-transparent text-neutral-400 hover:text-neutral-700 text-center text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        {!isSubscribed ? <Lock className="w-2.5 h-2.5 text-amber-500" /> : <Globe className="w-3 h-3" />}
                        <span>Visit Site</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                className="px-6 py-2 border border-neutral-200 hover:border-neutral-300 text-xs font-bold text-neutral-800 bg-white rounded-lg shadow-xs hover:shadow-sm transition cursor-pointer"
              >
                Load More Investors ({filteredInvestors.length - paginatedInvestors.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT 1 COLUMN: Leads Pipeline & CRM Panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-neutral-800">My Leads Pipeline CRM</h3>
            </div>
            <span className="bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-full text-xs font-mono">
              {savedLeadsWithDetails.length} Leads
            </span>
          </div>

          {savedLeadsWithDetails.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-xs font-medium">Your CRM is empty!</p>
              <p className="text-[11px] leading-relaxed px-4 text-neutral-500">
                Click **"Save Lead"** on any investor on the left to start tracking, managing notes, and monitoring outreach statuses here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {savedLeadsWithDetails.map((lead) => (
                <div key={lead.id} className="p-3.5 rounded-lg border border-neutral-100 bg-neutral-50/50 space-y-2 text-xs">
                  {/* Lead Firm Header */}
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-[11px]">
                    <span className="truncate">{lead.investor.firm}</span>
                    <button
                      onClick={() => toggleSaveLead(lead.investorId)}
                      className="text-[10px] text-neutral-400 hover:text-red-500 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  {/* Lead Contact Name */}
                  <div className="text-neutral-500 font-medium truncate text-[11px]">Contact: {lead.investor.name}</div>

                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400 font-medium">Status:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as SavedLead['status'])}
                      className="text-[10px] bg-white border border-neutral-200 rounded px-1.5 py-0.5 cursor-pointer font-semibold focus:outline-none"
                    >
                      <option value="Not Contacted">Not Contacted</option>
                      <option value="Drafted">Email Drafted</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting">Meeting Booked</option>
                      <option value="Follow Up">Follow Up Sent</option>
                      <option value="Passed">Passed / VC Declined</option>
                    </select>
                  </div>

                  {/* Dynamic notes box */}
                  <textarea
                    placeholder="Type customized qualification notes..."
                    value={lead.notes}
                    onChange={(e) => handleUpdateLeadNotes(lead.id, e.target.value)}
                    rows={2}
                    className="w-full text-[11px] p-2 bg-white border border-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-neutral-400 leading-relaxed resize-none"
                  />
                  
                  {/* Quick Mail to Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-neutral-400 font-mono font-medium">Added {lead.dateAdded}</span>
                    <button
                      onClick={() => {
                        if (!isSubscribed) {
                          onSubscribeClick();
                          return;
                        }
                        window.location.href = `mailto:${lead.investor.email}`;
                      }}
                      className="text-[10px] text-neutral-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {!isSubscribed ? <Lock className="w-3 h-3 text-amber-500" /> : <Mail className="w-3 h-3 text-neutral-500" />}
                      <span>Send Cold Email</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedLeadsWithDetails.length > 0 && (
            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={() => handleExportCSV('pipeline')}
                className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer shadow-3xs"
              >
                {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download Pipeline CRM (CSV)</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic AI Cold Email Drafting Overlay/Container */}
        <AnimatePresence>
          {draftingInvestor && isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-1.5 text-neutral-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>AI Cold Outreach Drafter</span>
                </div>
                <button
                  onClick={() => setDraftingInvestor(null)}
                  className="text-neutral-400 hover:text-neutral-600 font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-neutral-500 font-medium leading-relaxed">
                  Drafting cold intro to <strong>{draftingInvestor.name}</strong> of <strong>{draftingInvestor.firm}</strong>.
                </p>
                <p className="text-[10px] bg-amber-500/5 text-amber-800 p-2 rounded leading-relaxed border border-amber-500/10">
                  ⚡ <strong>Pro Tip:</strong> This email integrates your current <strong>Startup Profile</strong> metrics dynamically to maximize response rate.
                </p>
              </div>

              {isDraftingEmail ? (
                <div className="py-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-neutral-800" />
                  <p className="text-xs font-medium">Mentor is analyzing sectors and framing hook...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={draftedEmail}
                    onChange={(e) => setDraftedEmail(e.target.value)}
                    rows={8}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none font-mono leading-relaxed"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex-grow py-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Draft!
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" /> Copy Email Text
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${draftingInvestor.email}?subject=Intro request&body=${encodeURIComponent(draftedEmail)}`}
                      className="px-3.5 py-2 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white flex items-center justify-center transition"
                      title="Open in Mail App"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
