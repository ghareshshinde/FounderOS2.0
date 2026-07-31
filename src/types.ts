export interface PitchDeck {
  id: string;
  company: string;
  year: number;
  round: string;
  amountRaised: string;
  valuation: string;
  industry: string;
  description: string;
  keyTakeaway: string;
  slidesCount: number;
  lessonsLearned: string[];
  deckUrl?: string;
  slides: {
    number: number;
    title: string;
    description: string;
    highlight: string;
  }[];
}

export type InvestorType = 'VC Firm' | 'Angel Network' | 'CVC' | 'Accelerator' | 'Family Office';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  type: InvestorType;
  stageFocus: string[];
  sectors: string[];
  checkSize: string;
  location: string;
  email: string;
  website: string;
  portfolio: string[];
  notes?: string;
}

export interface SavedLead {
  id: string;
  investorId: string;
  status: 'Not Contacted' | 'Drafted' | 'Contacted' | 'Meeting' | 'Follow Up' | 'Passed';
  notes: string;
  dateAdded: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface CoFounderPost {
  id: string;
  authorName: string;
  authorTitle: string;
  linkedinUrl: string;
  avatarUrl?: string;
  roleNeeded: 'Technical (CTO)' | 'Growth / Marketing' | 'Product (CPO)' | 'Domain / CEO' | 'Design / UX' | 'Sales / Ops';
  startupName: string;
  sector: string;
  location: string;
  equityOffered: string;
  postExcerpt: string;
  postedTimeAgo: string;
  verifiedPost: boolean;
  tags: string[];
}

