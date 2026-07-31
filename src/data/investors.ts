import { Investor, InvestorType } from '../types';

// Top-tier real VCs as core premium database entries
export const PREMIUM_INVESTORS: Investor[] = [
  {
    id: "seq-01",
    name: "Roelof Botha",
    firm: "Sequoia Capital",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["SaaS", "FinTech", "AI / ML", "Consumer", "Cybersecurity"],
    checkSize: "$1M - $15M",
    location: "Silicon Valley",
    email: "partner@sequoiacap.com",
    website: "https://www.sequoiacap.com",
    portfolio: ["Airbnb", "Stripe", "Zoom", "YouTube", "WhatsApp"],
    notes: "One of the most prestigious VC firms in the world, focused on partnering with founders early."
  },
  {
    id: "a16z-02",
    name: "Marc Andreessen",
    firm: "Andreessen Horowitz (a16z)",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["SaaS", "AI / ML", "Web3 / Crypto", "Consumer", "HealthTech", "DeepTech"],
    checkSize: "$500k - $25M",
    location: "Silicon Valley",
    email: "pitches@a16z.com",
    website: "https://a16z.com",
    portfolio: ["Coinbase", "Figma", "GitHub", "Slack", "Substack"],
    notes: "Famous for the thesis 'software is eating the world' and has a massive operating agency model to help startups."
  },
  {
    id: "bench-03",
    name: "Peter Fenton",
    firm: "Benchmark Capital",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A"],
    sectors: ["SaaS", "Open Source", "Marketplaces", "AI / ML"],
    checkSize: "$1M - $10M",
    location: "Silicon Valley",
    email: "info@benchmark.com",
    website: "https://www.benchmark.com",
    portfolio: ["Uber", "Twitter", "Elastic", "Asana", "Modern Intelligence"],
    notes: "Equal-partnership structure, extremely concentrated portfolio, highly active board seats."
  },
  {
    id: "ffund-04",
    name: "Brian Singerman",
    firm: "Founders Fund",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["DeepTech", "Aerospace", "AI / ML", "FinTech", "SaaS", "Biotech"],
    checkSize: "$500k - $50M",
    location: "Silicon Valley",
    email: "contact@foundersfund.com",
    website: "https://foundersfund.com",
    portfolio: ["SpaceX", "Palantir", "Stripe", "Anduril", "Airbnb"],
    notes: "Known for contrarian investing in 'hard tech' and founder-friendly governance."
  },
  {
    id: "accel-05",
    name: "Rich Wong",
    firm: "Accel Partners",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B"],
    sectors: ["SaaS", "Cybersecurity", "FinTech", "Developer Tools"],
    checkSize: "$1M - $15M",
    location: "Silicon Valley",
    email: "pitches@accel.com",
    website: "https://www.accel.com",
    portfolio: ["Facebook", "Slack", "Atlassian", "Snyk", "UiPath"],
    notes: "Globally recognized firm with solid footprint in both US and Europe."
  },
  {
    id: "bessemer-06",
    name: "Byron Deeter",
    firm: "Bessemer Venture Partners",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["SaaS", "Cloud Infrastructure", "Cybersecurity", "FinTech"],
    checkSize: "$1M - $20M",
    location: "New York City",
    email: "cloud@bvp.com",
    website: "https://www.bvp.com",
    portfolio: ["Twilio", "Shopify", "Pinterest", "HashiCorp", "PagerDuty"],
    notes: "Author of the State of the Cloud report, legendary SaaS investment playbook."
  },
  {
    id: "yc-07",
    name: "Garry Tan",
    firm: "Y Combinator",
    type: "Accelerator",
    stageFocus: ["Pre-seed", "Seed"],
    sectors: ["SaaS", "FinTech", "AI / ML", "Consumer", "HealthTech", "DeepTech", "Web3 / Crypto"],
    checkSize: "$500k",
    location: "San Francisco",
    email: "apply@ycombinator.com",
    website: "https://www.ycombinator.com",
    portfolio: ["Airbnb", "Stripe", "Coinbase", "Dropbox", "Instacart", "Ginkgo Bioworks"],
    notes: "The world's leading startup accelerator, provides standard $500k post-money safe terms twice a year."
  },
  {
    id: "index-08",
    name: "Danny Rimer",
    firm: "Index Ventures",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["SaaS", "FinTech", "Consumer", "AI / ML", "Cybersecurity"],
    checkSize: "$500k - $15M",
    location: "London",
    email: "pitches@indexventures.com",
    website: "https://www.indexventures.com",
    portfolio: ["Adyen", "Figma", "Deliveroo", "Roblox", "Revolut"],
    notes: "Dual-headquartered in SF and London, bridges US and European tech ecosystems perfectly."
  },
  {
    id: "fround-09",
    name: "Rob Hayes",
    firm: "First Round Capital",
    type: "VC Firm",
    stageFocus: ["Pre-seed", "Seed"],
    sectors: ["SaaS", "Consumer", "FinTech", "Developer Tools", "AI / ML"],
    checkSize: "$250k - $2.5M",
    location: "New York City",
    email: "team@firstround.com",
    website: "https://firstround.com",
    portfolio: ["Uber", "Roblox", "Notion", "Looker", "Warby Parker"],
    notes: "The pioneer of institutional seed investing, famous for their supportive community resources."
  },
  {
    id: "light-10",
    name: "Ravi Mhatre",
    firm: "Lightspeed Venture Partners",
    type: "VC Firm",
    stageFocus: ["Seed", "Series A", "Series B", "Growth"],
    sectors: ["SaaS", "AI / ML", "Enterprise", "Consumer", "FinTech"],
    checkSize: "$1M - $25M",
    location: "Silicon Valley",
    email: "partner@lsvp.com",
    website: "https://lsvp.com",
    portfolio: ["Snapchat", "Nutanix", "MuleSoft", "Epic Games", "Nest"],
    notes: "Global reach with massive sector specific investment units."
  }
];

const SECTORS = [
  'SaaS', 'FinTech', 'HealthTech', 'AI / ML', 'Consumer',
  'Web3 / Crypto', 'DeepTech', 'EdTech', 'Cybersecurity', 'Logistics', 'ClimateTech'
];

const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];

const LOCATIONS = [
  'Silicon Valley', 'New York City', 'London', 'Berlin', 'Singapore',
  'San Francisco', 'Boston', 'Austin', 'Los Angeles', 'Toronto',
  'Tokyo', 'Sydney', 'Paris', 'Remote'
];

const FIRM_PREFIX = [
  'Apex', 'Blue', 'Beacon', 'Capital', 'Catalyst', 'Decibel', 'Delta', 'Elevate',
  'Emergence', 'Equinox', 'First', 'Foundry', 'Frontier', 'General', 'Genesis', 'Global',
  'Horizon', 'Ignition', 'Infinity', 'Insight', 'Keystone', 'Latitude', 'Matrix', 'Nexus',
  'Nova', 'Octane', 'Origin', 'Pinnacle', 'Polaris', 'Prime', 'Red', 'Sovereign', 'Summit',
  'Synergy', 'Talon', 'Trident', 'Valo', 'Vanguard', 'Velocity', 'Zenith'
];

const FIRM_SUFFIX = [
  'Ventures', 'Capital', 'Partners', 'Fund', 'Growth', 'Venture Capital', 'Seed Fund', 'Equity'
];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Andrew', 'Kimberly', 'Paul', 'Emily', 'Joshua', 'Donna',
  'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Diaz', 'Parker', 'Cruz'
];

const CHECK_SIZES = [
  '$50k - $250k',
  '$250k - $1M',
  '$1M - $5M',
  '$5M - $15M',
  '$15M - $50M'
];

const INVESTOR_TYPES: InvestorType[] = [
  'VC Firm', 'Angel Network', 'CVC', 'Accelerator', 'Family Office'
];

const MOCK_PORTFOLIOS = [
  ['Linear', 'Vercel', 'Retool', 'Supabase'],
  ['Deel', 'Rippling', 'Brex', 'Gusto'],
  ['Hugging Face', 'Scale AI', 'Jasper', 'Midjourney'],
  ['Stripe', 'Adyen', 'Wise', 'Platypus'],
  ['Deliveroo', 'Gopuff', 'DoorDash', 'Instacart'],
  ['Uniswap', 'OpenSea', 'Solana', 'Chainlink'],
  ['Anduril', 'Astranis', 'Hadrian', 'Shield AI'],
  ['Figma', 'Canva', 'Notion', 'Coda'],
  ['Snyk', '1Password', 'CrowdStrike', 'Okta'],
  ['Segment', 'Amplitude', 'PostHog', 'Mixpanel']
];

// Helper to generate realistic investor data procedurally to reach 5,000 investors
// This prevents large file sizes while giving a fully functional high-volume searchable dataset.
export function generateInvestors(): Investor[] {
  const result: Investor[] = [...PREMIUM_INVESTORS];
  const targetCount = 5000;
  
  // Use a simple LCG (Linear Congruential Generator) for deterministic seed generation
  // so the list is always identical.
  let seed = 42;
  function random(): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(random() * arr.length)];
  }

  function randomSubarray<T>(arr: T[], maxCount: number = 3): T[] {
    const shuffled = [...arr].sort(() => 0.5 - random());
    const count = Math.floor(random() * maxCount) + 1;
    return shuffled.slice(0, count);
  }

  for (let i = PREMIUM_INVESTORS.length; i < targetCount; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    
    const prefix = randomElement(FIRM_PREFIX);
    const suffix = randomElement(FIRM_SUFFIX);
    const firmName = `${prefix} ${suffix}`;
    
    const type = randomElement(INVESTOR_TYPES);
    const location = randomElement(LOCATIONS);
    const stages = randomSubarray(STAGES, 2);
    const sectors = randomSubarray(SECTORS, 3);
    const checkSize = randomElement(CHECK_SIZES);
    const portfolio = randomElement(MOCK_PORTFOLIOS);
    
    const id = `gen-${i}`;
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const domain = firmName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const email = `${emailPrefix}@${domain}`;
    const website = `https://www.${domain}`;

    result.push({
      id,
      name: fullName,
      firm: firmName,
      type,
      stageFocus: stages,
      sectors,
      checkSize,
      location,
      email,
      website,
      portfolio,
      notes: `Active investor in ${sectors.join(', ')} companies. Interested in high growth teams at the ${stages.join(' & ')} stages.`
    });
  }

  return result;
}

// Singleton instances for optimization
let cachedInvestors: Investor[] | null = null;

export function getInvestors(): Investor[] {
  if (!cachedInvestors) {
    cachedInvestors = generateInvestors();
  }
  return cachedInvestors;
}
