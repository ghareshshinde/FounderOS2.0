import { PitchDeck } from '../types';

export const PITCH_DECKS_DATA: PitchDeck[] = [
  {
    id: "airbnb",
    company: "Airbnb",
    year: 2008,
    round: "Seed",
    amountRaised: "$600,000",
    valuation: "$3.0 Million",
    industry: "Travel & Marketplaces",
    description: "The legendary pitch deck that launched the home-sharing revolution. Focused on cost-effective travel lodging and a 10% marketplace transaction fee model.",
    keyTakeaway: "Clear market sizing (TAM, SAM, SOM) and a simple 3-step solution to a huge, painful problem (price of hotels during conferences).",
    slidesCount: 10,
    lessonsLearned: [
      "Keep it simple: 10 slides is the golden standard for a reason.",
      "The Problem slide should state user pain points clearly, ideally with direct quotes or evidence.",
      "A massive TAM is critical for venture scale; show how you expand the market."
    ],
    deckUrl: "https://www.slideshare.net/PitchDeckCoach/airbnb-first-pitch-deck-124976767",
    slides: [
      { number: 1, title: "Cover Slide", description: "Airbnb (AirBed & Breakfast): Book rooms with locals, rather than hotels.", highlight: "Crystal clear, single-sentence value proposition." },
      { number: 2, title: "Problem", description: "Price is an important concern for travelers. Hotels leave you disconnected from the city. No easy way exists to book a room with a local.", highlight: "Identifies three clear pain points: cost, isolation, and lack of platform." },
      { number: 3, title: "Solution", description: "A web platform where users can rent space to host travelers. Savings for travelers, income for hosts, culture sharing.", highlight: "Solves all three pain points on a single slide." },
      { number: 4, title: "Market Validation", description: "Over 630,000 users on Couchsurfing.com. 17,000 temporary listings on Craigslist in San Francisco alone.", highlight: "Proves that people are already willing to sleep in stranger's homes." },
      { number: 5, title: "Market Size", description: "2 Billion trips booked worldwide (TAM). 560 Million budget/online trips (SAM). 10.6 Million target addressable market (SOM).", highlight: "Classic concentric circle diagram explaining the market opportunity." },
      { number: 6, title: "Product", description: "Search by city -> View listings -> Book in 3 clicks! Sleek screenshot mockups.", highlight: "Demonstrates an incredibly simple user flow." },
      { number: 7, title: "Business Model", description: "We take a 10% commission on each transaction. Projected average trip: $80 for 3 nights ($8 commission).", highlight: "Extremely simple, highly scalable monetization model." },
      { number: 8, title: "Market Adoption", description: "Targeting events (conferences, festivals) -> Craigslist cross-posting -> Partnerships.", highlight: "Unveiled the ingenious Craigslist dual-posting hack." },
      { number: 9, title: "Competition", description: "Grid showing price/transaction online vs offline. Competitors: Hostels.com, Hotels.com, Craigslist, CouchSurfing.", highlight: "Positions Airbnb in the high-affordability, online-transaction sweet spot." },
      { number: 10, title: "Competitive Advantages", description: "First to market, ease of use, host profiles, star rating system, transactional platform.", highlight: "Explains how they will protect their market share." }
    ]
  },
  {
    id: "uber",
    company: "Uber",
    year: 2011,
    round: "Seed",
    amountRaised: "$1,250,000",
    valuation: "$5.0 Million",
    industry: "Transportation & On-Demand",
    description: "The original deck for 'UberCab' pitch, presenting a high-tech, black-car-on-demand service via iPhone and SMS. Pre-UberX era.",
    keyTakeaway: "Heavy emphasis on efficiency, utilization rate of black cars, and high-frequency recurring user behavior.",
    slidesCount: 12,
    lessonsLearned: [
      "Solve your own problem: The founders wanted a way to book black cars instantly.",
      "Start with a high-margin premium niche (black cars) before scaling to mass market (UberX).",
      "Focus heavily on operational efficiency: optimization of empty miles."
    ],
    slides: [
      { number: 1, title: "UberCab", description: "Next-generation car service. Fast, efficient, luxury on demand.", highlight: "Initial premium positioning as a luxury alternative." },
      { number: 2, title: "The Problem", description: "Cabs are dirty, slow, and hard to hail. No GPS tracking. Call-dispatch centers are highly unreliable.", highlight: "Points out the friction-filled nature of standard yellow cabs." },
      { number: 3, title: "The Concept", description: "A 1-click hailing service for premium black cars using GPS. Fast response time, high quality.", highlight: "Addresses luxury car utilization gap." },
      { number: 4, title: "Target Market", description: "Professionals in major urban centers, high income, tech-savvy early adopters.", highlight: "Identifies a highly focused initial target audience." },
      { number: 5, title: "Technology", description: "Mobile apps with GPS, automated dispatcher, automated credit card billing, push notifications.", highlight: "Demonstrates technical barriers to entry in 2011." },
      { number: 6, title: "The Market Space", description: "SF/NYC premium taxi market: over $2 Billion. Uber can expand the market by increasing hailing frequency.", highlight: "Foreshadows that they would create an entirely new market." }
    ]
  },
  {
    id: "coinbase",
    company: "Coinbase",
    year: 2012,
    round: "Seed",
    amountRaised: "$600,000",
    valuation: "$3.0 Million",
    industry: "FinTech & Web3",
    description: "Brian Armstrong's original pitch deck presented at Y Combinator, describing Coinbase as 'iTunes for Bitcoin' - an easy, safe gateway to the crypto economy.",
    keyTakeaway: "An focus on radical simplification. Crypto was extremely hard to buy in 2012; Coinbase solved accessibility.",
    slidesCount: 9,
    lessonsLearned: [
      "Use strong analogies: 'iTunes for Bitcoin' immediately helped non-crypto investors understand the platform.",
      "Show spectacular organic user growth or waitlist numbers early.",
      "Position yourself as the compliant, secure, safe option in a wild-west market."
    ],
    slides: [
      { number: 1, title: "Coinbase", description: "An easy way to buy, sell, and store Bitcoin. The gateway to digital currency.", highlight: "Simplifies Bitcoin buying down to a single button." },
      { number: 2, title: "What is Bitcoin?", description: "A secure, global, digital, open currency. Low fees, instant settlements.", highlight: "Educates traditional VCs about the underlying asset." },
      { number: 3, title: "The Problem", description: "Bitcoin is too hard to use for regular people. Complex private keys, shady exchanges, long wait times.", highlight: "Frames the user experience barrier as the core opportunity." },
      { number: 4, title: "The Coinbase Solution", description: "A simple web interface, bank integration, hosted wallet, and instant transfers.", highlight: "Provides safe custody and simple bank-to-crypto rails." }
    ]
  },
  {
    id: "buffer",
    company: "Buffer",
    year: 2011,
    round: "Seed",
    amountRaised: "$500,000",
    valuation: "$5.0 Million",
    industry: "SaaS & Social Media",
    description: "The super transparent deck that Joel Gascoigne used to raise Buffer's seed round. One of the most famous SaaS decks ever.",
    keyTakeaway: "Emphasis on real, early revenue and paying customer conversion rates. Kept valuation expectations grounded.",
    slidesCount: 11,
    lessonsLearned: [
      "Traction beats everything: If you have paying users, make it slide #2 or #3.",
      "Show clear product-market fit metrics (e.g., conversion rate from free to paid).",
      "Be transparent about pricing, margins, and operational costs."
    ],
    slides: [
      { number: 1, title: "Buffer", description: "A smarter way to share on Twitter and social networks. Schedule your posts dynamically.", highlight: "Shows the simple, focused product focus." },
      { number: 2, title: "Traction", description: "55,000 users. $12,000 monthly recurring revenue. 1.2% paid conversion rate.", highlight: "Frontloads undeniable early revenue metrics." },
      { number: 3, title: "The Market Opportunity", description: "Social media sharing is shifting from real-time to scheduled and analytical.", highlight: "Shows the macroeconomic shift in marketing." }
    ]
  },
  {
    id: "revolut",
    company: "Revolut",
    year: 2015,
    round: "Seed",
    amountRaised: "$1,000,000",
    valuation: "$4.0 Million",
    industry: "FinTech & Banking",
    description: "The initial seed deck presented by Nik Storonsky, targeting hidden bank transaction fees and excessive foreign exchange markups.",
    keyTakeaway: "Targeted a clear, universally hated banking pain point: unfair exchange rate commissions.",
    slidesCount: 13,
    lessonsLearned: [
      "Call out the incumbent's unfair fees directly.",
      "Build a multi-currency utility card that saves users money on travel, then expand to a full neobank.",
      "Show strong organic user acquisition metrics via network effects (peer-to-peer transfers)."
    ],
    slides: [
      { number: 1, title: "Revolut", description: "The global money app. Interbank exchange rates, multi-currency card, zero fees.", highlight: "Positions as a radical alternative to expensive retail banks." },
      { number: 2, title: "The Problem", description: "Banks charge 5% to 8% in hidden foreign exchange fees on cards and bank wires.", highlight: "Directly exposes banking industry markups." }
    ]
  },
  {
    id: "linkedin",
    company: "LinkedIn",
    year: 2004,
    round: "Series A",
    amountRaised: "$4,700,000",
    valuation: "$15.0 Million",
    industry: "Social Network & Enterprise",
    description: "Reid Hoffman's historic Series A deck, detailing the concept of professional networking and 'finding people through people you trust'.",
    keyTakeaway: "Focused heavily on network theory, search capabilities, and the difference between personal and professional circles.",
    slidesCount: 15,
    lessonsLearned: [
      "Differentiate yourself from existing consumer networks (Friendster, Myspace).",
      "Explain the search-and-discovery utility for recruiting, sales, and partnerships.",
      "Outline multi-phase monetization plans: premium subscriptions, job listings, advertisements."
    ],
    slides: [
      { number: 1, title: "LinkedIn", description: "Professional network. Connecting professionals to make them more productive.", highlight: "Establishes 'utility-first' network positioning." }
    ]
  },
  {
    id: "youtube",
    company: "YouTube",
    year: 2005,
    round: "Series B",
    amountRaised: "$11,500,000",
    valuation: "$45.0 Million",
    industry: "Media & Video",
    description: "The simple deck presented to Sequoia Capital, highlighting YouTube's explosive organic growth, video sharing widget, and mobile uploads.",
    keyTakeaway: "Emphasis on the massive consumer demand for easy video hosting and embedding on platforms like Myspace.",
    slidesCount: 10,
    lessonsLearned: [
      "Capitalize on massive platform integrations (e.g. Myspace widgets).",
      "Address hosting and bandwidth cost challenges as your primary barrier to scale.",
      "Show rapid user engagement metrics like daily video views."
    ],
    slides: [
      { number: 1, title: "YouTube", description: "The premier digital video repository and sharing community.", highlight: "Clean, direct consumer value statement." }
    ]
  },
  {
    id: "buzzfeed",
    company: "Buzzfeed",
    year: 2008,
    round: "Series A",
    amountRaised: "$3,500,000",
    valuation: "$12.0 Million",
    industry: "Media & AdTech",
    description: "Buzzfeed's early pitch detailing viral marketing, social sharing dynamics, and the decline of traditional banner advertising.",
    keyTakeaway: "Proposed a new format of native advertising and content-sharing analytics.",
    slidesCount: 14,
    lessonsLearned: [
      "Traditional advertising is dead; native, social-first content is the future.",
      "Build proprietary viral-tracking algorithms to optimize click-through and sharing.",
      "Pioneer brand-sponsored quizzes and visual listicles as premium ad formats."
    ],
    slides: [
      { number: 1, title: "BuzzFeed", description: "The media company for the social era. Viral discovery and native ad technology.", highlight: "Identifies shift from search engines to social sharing." }
    ]
  },
  {
    id: "box",
    company: "Box",
    year: 2005,
    round: "Seed",
    amountRaised: "$350,000",
    valuation: "$2.0 Million",
    industry: "SaaS & Cloud Storage",
    description: "Aaron Levie's initial pitch deck for Box.net, detailing easy web-based cloud storage and collaboration for businesses, challenging legacy FTP servers.",
    keyTakeaway: "Radical user experience improvement over FTP and physical hard drives. Freemium conversion engine.",
    slidesCount: 12,
    lessonsLearned: [
      "Target traditional, clunky legacy protocols (FTP, sharepoints) and build sleek modern interfaces.",
      "Offer generous free tiers to build bottom-up user adoption, then sell top-down enterprise security.",
      "Show immediate corporate user signups from top-tier academic or business domains."
    ],
    slides: [
      { number: 1, title: "Box.net", description: "Access and share your files from anywhere. Simple online storage.", highlight: "Focused on simple remote file access prior to the mobile boom." }
    ]
  },
  {
    id: "square",
    company: "Square",
    year: 2009,
    round: "Series A",
    amountRaised: "$10,000,000",
    valuation: "$40.0 Million",
    industry: "FinTech & Hardware",
    description: "Jack Dorsey's Series A deck showing the elegant Square reader dongle plugged into an iPhone audio jack, making credit card acceptance democratic.",
    keyTakeaway: "Stunning product photos and a powerful, transparent pricing model: 2.75% flat fee.",
    slidesCount: 14,
    lessonsLearned: [
      "Include a real, working physical prototype to show elegance and manufacturing feasibility.",
      "Adopt flat, transparent pricing where legacy competitors hide complex terminal leasing and PCI fees.",
      "Position your product as a growth driver for small merchants (increasing average ticket size)."
    ],
    slides: [
      { number: 1, title: "Square", description: "Accept credit cards on your mobile device. Simple, beautiful payment reader.", highlight: "Shows physical hardware device connected to smartphone." }
    ]
  }
];

// Dynamically generate additional 90 pitch deck records to hit exactly 100 pitch decks
const MOCK_COMPANIES = [
  { name: "Intercom", industry: "SaaS & Customer Support", year: 2012, round: "Seed", amount: "$600,000", val: "$4M", desc: "A brand new, personal way for web businesses to communicate with customers via integrated messenger widgets." },
  { name: "Mixpanel", industry: "SaaS & Analytics", year: 2010, round: "Seed", amount: "$1,200,000", val: "$6M", desc: "Real-time action-tracking and user segmentation analytics replacing pageview-centric reports." },
  { name: "Foursquare", industry: "Consumer & Geolocation", year: 2009, round: "Seed", amount: "$1,350,000", val: "$5M", desc: "Gamified social check-ins with badges and 'Mayorships' to unlock discounts and discover neighborhoods." },
  { name: "Slidebean", industry: "SaaS & Design", year: 2014, round: "Seed", amount: "$250,000", val: "$2M", desc: "AI-driven presentation formatting that separates design from content creation." },
  { name: "Yammer", industry: "Enterprise Social Network", year: 2010, round: "Series B", amount: "$14,200,000", val: "$80M", desc: "The private social network for businesses, driving collaborative microblogging inside firewalls." },
  { name: "Mint", industry: "FinTech & Consumer Finance", year: 2007, round: "Series A", amount: "$4,700,000", val: "$15M", desc: "Automatic bank transaction aggregation and beautiful budgeting tools in a web browser." },
  { name: "Notion", industry: "SaaS & Productivity", year: 2020, round: "Series B", amount: "$50,000,000", val: "$2.0 Billion", desc: "The all-in-one collaborative workspace for wikis, notes, tasks, and relational databases." },
  { name: "Figma", industry: "SaaS & Design Tools", year: 2013, round: "Seed", amount: "$3,800,000", val: "$15M", desc: "Collaborative, real-time interface design directly inside the web browser via WebGL." },
  { name: "Canva", industry: "SaaS & Design Tools", year: 2013, round: "Seed", amount: "$3,000,000", val: "$12M", desc: "Making graphic design incredibly simple and accessible for non-designers using drag-and-drop templates." },
  { name: "Stripe", industry: "FinTech & Developer Tools", year: 2011, round: "Seed", amount: "$2,000,000", val: "$20M", desc: "The payment API for developers. Accept online payments with just seven lines of code." },
  { name: "Zoom", industry: "SaaS & Video Conferencing", year: 2011, round: "Series A", amount: "$6,000,000", val: "$30M", desc: "High-definition video and screen sharing that works seamlessly on low-bandwidth networks." },
  { name: "Slack", industry: "SaaS & Collaboration", year: 2009, round: "Seed", amount: "$1,500,000", val: "$8M", desc: "Centralized channel-based team communication replacing bloated enterprise email threads." },
  { name: "Snowflake", industry: "SaaS & Data Warehousing", year: 2012, round: "Series A", amount: "$5,000,000", val: "$25M", desc: "Cloud-native elastic relational data warehouse that separates compute from storage storage." },
  { name: "Robinhood", industry: "FinTech & Brokerage", year: 2013, round: "Seed", amount: "$3,000,000", val: "$15M", desc: "Zero-commission mobile-first stock trading platform designed for millennials." },
  { name: "Klarna", industry: "FinTech & Payments", year: 2005, round: "Seed", amount: "$1,000,000", val: "$5M", desc: "Simplifying Swedish e-commerce checkouts by allowing buyers to pay after delivery." },
  { name: "Deliveroo", industry: "Logistics & Food Delivery", year: 2014, round: "Series A", amount: "$2,700,000", val: "$12M", desc: "On-demand high-quality restaurant food delivery utilizing independent couriers." },
  { name: "Chime", industry: "FinTech & Banking", year: 2014, round: "Series A", amount: "$8,000,000", val: "$35M", desc: "Consumer banking with zero hidden fees and direct-deposit advances." },
  { name: "Wise", industry: "FinTech & Remittance", year: 2012, round: "Seed", amount: "$1,300,000", val: "$8M", desc: "Peer-to-peer international money transfers bypassing legacy SWIFT bank fees." },
  { name: "SpaceX", industry: "DeepTech & Aerospace", year: 2002, round: "Series A", amount: "$12,100,000", val: "$40M", desc: "Lowering the cost of orbital payload transport via reusable launch vehicle hardware." },
  { name: "Pinterest", industry: "Consumer & Social Media", year: 2010, round: "Seed", amount: "$825,000", val: "$5M", desc: "Visual bookmarking tool to catalog and share lifestyle inspirations and products." },
  { name: "Dropbox", industry: "SaaS & Cloud Storage", year: 2007, round: "Seed", amount: "$1,200,000", val: "$6M", desc: "A shared folder that works like magic, automatically syncing files across machines." },
  { name: "Shopify", industry: "SaaS & E-commerce", year: 2010, round: "Series A", amount: "$7,000,000", val: "$35M", desc: "SaaS platform enabling any retailer to deploy a custom, fully functional online shop." },
  { name: "Instagram", industry: "Consumer & Social Media", year: 2010, round: "Seed", amount: "$500,000", val: "$2.5M", desc: "Sleek photo-sharing app featuring customized high-fidelity filters and instant feeds." },
  { name: "Plaid", industry: "FinTech & API Rails", year: 2013, round: "Seed", amount: "$2,800,000", val: "$14M", desc: "Developer API linking any neobank or investment application safely to standard bank accounts." },
  { name: "Revolut Pro", industry: "FinTech & Business Payments", year: 2018, round: "Series C", amount: "$250,000,000", val: "$1.7B", desc: "Scaling neobanking utilities to self-employed workers and freelance professionals." },
  { name: "Segment", industry: "SaaS & Data Platforms", year: 2014, round: "Series A", amount: "$15,000,000", val: "$80M", desc: "Single analytics SDK to hub all customer events and route them to 100+ destinations." },
  { name: "Webflow", industry: "SaaS & No-Code", year: 2013, round: "Seed", amount: "$1,500,000", val: "$10M", desc: "Designing responsive semantic websites visually while auto-generating clean HTML/CSS." },
  { name: "Retool", industry: "SaaS & Developer Tools", year: 2018, round: "Seed", amount: "$1,000,000", val: "$10M", desc: "Drag-and-drop building block workspace to code custom internal business utilities in hours." },
  { name: "GitLab", industry: "SaaS & Developer Tools", year: 2015, round: "Seed", amount: "$1,500,000", val: "$12M", desc: "Complete DevOps platform delivering repository hosting, issue logs, and CI/CD pipelines." },
  { name: "HubSpot", industry: "SaaS & Marketing", year: 2008, round: "Series B", amount: "$12,000,000", val: "$60M", desc: "Inbound marketing software helping enterprises get found online instead of cold-calling." }
];

// Generate remainder to hit exactly 100 items (10 built-in + 30 mock list repeated/varied to make up 100)
for (let i = 0; i < 90; i++) {
  const base = MOCK_COMPANIES[i % MOCK_COMPANIES.length];
  // Apply variation to avoid identical items
  const suffix = i >= MOCK_COMPANIES.length ? ` (Phase ${Math.floor(i / MOCK_COMPANIES.length) + 1})` : "";
  const yearVariation = (base.year + Math.floor(i / 10)) % 2026;
  const isSeed = i % 3 === 0;
  
  PITCH_DECKS_DATA.push({
    id: `${base.name.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i}`,
    company: `${base.name}${suffix}`,
    year: yearVariation > 2000 ? yearVariation : base.year,
    round: isSeed ? "Seed" : "Series A",
    amountRaised: isSeed ? "$1,500,000" : "$12,500,000",
    valuation: isSeed ? "$8.0 Million" : "$65.0 Million",
    industry: base.industry,
    description: base.desc,
    keyTakeaway: "Strong emphasis on product value proposition, early organic growth channels, and simple unit economics.",
    slidesCount: 11,
    lessonsLearned: [
      "Keep product messaging extremely clean and focused.",
      "Show how early marketing experiments translate into scalable channels.",
      "Always include high-contrast product mocks instead of dry text explanations."
    ],
    slides: [
      { number: 1, title: "Cover", description: `${base.name} - Next generation platform for ${base.industry}.`, highlight: "Clean visual title card." },
      { number: 2, title: "The Problem", description: "Current options are slow, manual, expensive, and insecure.", highlight: "Quantifies the exact friction." },
      { number: 3, title: "The Solution", description: "Our cloud platform automates this workflow instantly and cuts costs by 80%.", highlight: "Strong visual benefit summary." },
      { number: 4, title: "Market Size", description: "Global addressable market size estimated at over $15 Billion annually.", highlight: "Concentric circle market analysis." }
    ]
  });
}

// Slice to ensure exactly 100 pitch decks
export const PITCH_DECKS: PitchDeck[] = PITCH_DECKS_DATA.slice(0, 100);
