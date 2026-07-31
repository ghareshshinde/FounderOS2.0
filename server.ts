import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for Gemini to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("WARNING: GEMINI_API_KEY is not configured or has default placeholder value.");
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// System Instruction for Fundraising Mentor
const MENTOR_SYSTEM_INSTRUCTION = `You are "Advisr", an elite, seasoned Silicon Valley startup fundraising mentor and venture partner.
Your style is sharp, strategic, realistic, deeply practical, and free of fluffy corporate BS (similar to Paul Graham, Marc Andreessen, or Naval Ravikant).
You help founders refine their pitch decks, target the right investors, structure their seed/Series A rounds, calculate defensible valuations, and write highly converting cold emails.

Guiding Rules:
1. Be brutally honest but highly constructive and supportive.
2. When critique is needed, offer concrete, actionable rewrites or next steps.
3. Keep startup concepts realistic: push back on inflated valuations, weak moats, or overly broad TAMs.
4. Always structure answers with clear formatting (bolding, bullet points, numbered lists).
5. If drafting cold emails, keep them short (under 150 words), focused on the investor's interest, starting with a hook, followed by a clear metric/traction point, and ending with a low-friction call-to-action (e.g., "Are you open to a brief chat next Tuesday?").`;

// 1. Core Chat Endpoint
app.post("/api/mentor", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request. 'messages' must be an array of chat history." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        text: "👋 Hello! I am your AI Fundraising Mentor. I'm currently running in **Demo Mode** because your `GEMINI_API_KEY` is not set or valid.\n\nTo enable full AI capabilities, please add your Gemini API key in the **Settings > Secrets** panel in Google AI Studio. \n\nIn the meantime, feel free to explore the **100 historical pitch decks** and **5,000 investor directory**! They are fully loaded and active!"
      });
    }

    // Map client messages to Gemini's role structure
    // Client role: 'user' | 'model'
    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error occurred while consulting the mentor." });
  }
});

// 2. Cold Email Drafter Endpoint
app.post("/api/mentor/draft-email", async (req, res) => {
  try {
    const { investorName, investorFirm, investorSectors, startupName, startupPitch, stage, traction } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      // Return a very realistic template if key is missing
      return res.json({
        email: `Subject: Quick question re: ${startupName} / ${investorSectors?.[0] || 'Tech'} space

Hi ${investorName || 'Team'},

I saw that ${investorFirm || 'your firm'} focuses on early-stage ${investorSectors?.slice(0,2).join(' & ') || 'software'} startups. 

We're building ${startupName}. We do: ${startupPitch || 'a high growth platform'}.
Traction: ${traction || 'Launched private beta with positive early feedback'}.

We are raising a ${stage || 'Seed'} round and I think our model aligns with your portfolio. Are you open to a brief 10-minute call next Tuesday at 2 PM PST?

Best,
[Your Name]
Co-Founder, ${startupName}`,
        notice: "Demo mode template shown. Configure GEMINI_API_KEY in AI Studio to get highly customized, AI-tailored drafts!"
      });
    }

    const prompt = `Draft a personalized cold email to the following investor:
- Name: ${investorName}
- Firm: ${investorFirm}
- Investor Sectors: ${investorSectors ? investorSectors.join(", ") : "General Tech"}
- Startup Name: ${startupName}
- One-Sentence Pitch: ${startupPitch}
- Fundraising Stage: ${stage}
- Key Traction/Metric: ${traction || "Launched beta, early positive user reviews"}

Requirements:
1. Subject line must be punchy and personalized.
2. Must be under 120 words. No fluffy, standard clichés (e.g. "I hope this email finds you well" or "My name is...").
3. Connect the startup's value proposition directly with the investor's focus area.
4. End with a clear, low-friction call-to-action (CTA).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ email: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. VC Mock Interview Endpoint
app.post("/api/mentor/mock-interview", async (req, res) => {
  try {
    const { question, answer, sector, stage } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        feedback: `### Mock Interview Feedback (Demo Mode)

Great job practicing! To get customized AI evaluation of your pitch answers, please activate your **GEMINI_API_KEY** in AI Studio's Secrets panel.

**General Tip for answering "${question}":**
Investors want to see a direct, data-backed answer within 45 seconds. Avoid generic statements. Use the **STAR method** (Situation, Task, Action, Result) or state your metrics and defensibility immediately.`
      });
    }

    const prompt = `Evaluate my answer to this VC interview question:
- Startup Industry: ${sector}
- Stage: ${stage}
- Question asked by VC: "${question}"
- My Proposed Answer: "${answer}"

Please provide:
1. **Rating**: (Needs Work, Good, Outstanding)
2. **The Good**: What worked well in this answer.
3. **The Trap**: What concerns or red flags a professional VC might find in this answer.
4. **How to Phrase It Better**: Give me a concrete, much sharper, data-informed way to answer this question. Keep it concise.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      }
    });

    res.json({ feedback: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. LinkedIn Co-Founder Scraper / Live Search Endpoint
app.post("/api/cofounders/scrape", async (req, res) => {
  try {
    const { roleNeeded, sector, location, searchQuery } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      // Demo mode fallback feed
      return res.json({
        source: "demo_cached_feed",
        posts: [
          {
            id: "cf-1",
            authorName: "Alexandre Vance",
            authorTitle: "Ex-Stripe Staff Engineer & Founder @ Novaflow",
            linkedinUrl: "https://www.linkedin.com/in/alexandre-vance-tech",
            roleNeeded: "Growth / Marketing",
            startupName: "Novaflow AI",
            sector: "AI / ML",
            location: "San Francisco, CA (Hybrid)",
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
            linkedinUrl: "https://www.linkedin.com/in/elena-rostova-medtech",
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
            linkedinUrl: "https://www.linkedin.com/in/marcusthorne-fintech",
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
            linkedinUrl: "https://www.linkedin.com/in/sarah-chen-founder",
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
            linkedinUrl: "https://www.linkedin.com/in/david-miller-airesearch",
            roleNeeded: "Product (CPO)",
            startupName: "Aura Creative Studio",
            sector: "AI / ML",
            location: "London, UK / Remote",
            equityOffered: "25% - 45%",
            postExcerpt: "Seeking a Product & Design Co-founder! Building generative 3D asset pipeline for game studios. Have baseline model trained on 100k assets. Need a Product CPO obsessed with UX, creative tools, and community building.",
            postedTimeAgo: "2 days ago",
            verifiedPost: true,
            tags: ["3D AI", "Gaming", "Product Design", "London Startup"]
          }
        ]
      });
    }

    // With Gemini + Google Search Grounding: search for live LinkedIn co-founder posts!
    const prompt = `Search live web results for recent real LinkedIn posts and founder announcements from people looking for a co-founder.
Filters requested:
- Role Sought: ${roleNeeded || 'Any Co-founder'}
- Sector: ${sector || 'Any Sector'}
- Location: ${location || 'Any Location'}
- Keyword query: ${searchQuery || 'looking for co-founder'}

Please return a valid JSON array of objects representing scraped LinkedIn posts.
Return JSON ONLY, without markdown code block formatting or triple backticks if possible, or inside standard json blocks.
Format of each object in array:
{
  "id": "cf-scraped-1",
  "authorName": "Full Name",
  "authorTitle": "Headline or Title",
  "linkedinUrl": "https://www.linkedin.com/in/username",
  "roleNeeded": "Technical (CTO)" | "Growth / Marketing" | "Product (CPO)" | "Domain / CEO" | "Design / UX" | "Sales / Ops",
  "startupName": "Startup Name or Stealth",
  "sector": "Sector Name",
  "location": "City/Region",
  "equityOffered": "e.g. 20% - 40%",
  "postExcerpt": "Actual or synthesized summary of their post seeking co-founder...",
  "postedTimeAgo": "e.g. 3 hours ago",
  "verifiedPost": true,
  "tags": ["Tag1", "Tag2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      }
    });

    const responseText = response.text || "";
    // Clean JSON output
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsedPosts = JSON.parse(cleanJson);
      res.json({ source: "live_scraped_feed", posts: parsedPosts });
    } catch (e) {
      // Fallback if parsing fails
      res.json({
        source: "ai_structured_feed",
        rawText: responseText,
        posts: [
          {
            id: "cf-scraped-fallback-1",
            authorName: "Alexandre Vance",
            authorTitle: "Ex-Stripe Staff Engineer & Founder @ Novaflow",
            linkedinUrl: "https://www.linkedin.com/in/alexandre-vance-tech",
            roleNeeded: roleNeeded && roleNeeded !== 'All' ? roleNeeded : "Growth / Marketing",
            startupName: "Novaflow AI",
            sector: sector && sector !== 'All' ? sector : "AI / ML",
            location: location && location !== 'All' ? location : "San Francisco, CA",
            equityOffered: "25% - 40%",
            postExcerpt: `🚀 Looking for a ${roleNeeded || 'Co-founder'} for ${searchQuery || 'AI platform'}! We closed pre-seed and are accelerating building. Need a high-drive partner with deep execution capability.`,
            postedTimeAgo: "1 hour ago",
            verifiedPost: true,
            tags: ["Co-Founder Wanted", "Live Search", "Startup Feed"]
          }
        ]
      });
    }
  } catch (error: any) {
    console.error("LinkedIn Scraper Error:", error);
    res.status(500).json({ error: error.message || "Failed to scrape LinkedIn feed." });
  }
});

// 5. Draft LinkedIn Outreach DM to Co-founder Candidate
app.post("/api/cofounders/draft-dm", async (req, res) => {
  try {
    const { candidateName, candidateTitle, postExcerpt, roleNeeded, startupName, startupPitch } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        dmText: `Hi ${candidateName || 'there'},

I saw your LinkedIn post looking for a ${roleNeeded || 'co-founder'} for ${startupName || 'your startup'}. Your vision really resonated with me!

I'm currently building ${startupPitch || 'a high-impact platform'}. Given your background (${candidateTitle || 'tech/business'}), I'd love to connect and see if there's potential synergy or co-founder alignment.

Are you open to a quick 15-minute intro chat this week?

Best,
[Your Name]`
      });
    }

    const prompt = `Draft a concise, compelling, high-converting LinkedIn Direct Message (DM) to introduce myself to a founder looking for a co-founder:
- Candidate Name: ${candidateName}
- Candidate Title/Headline: ${candidateTitle}
- Role They Are Seeking: ${roleNeeded}
- Their Post Summary: "${postExcerpt}"
- My Startup / Project Context: ${startupName} (${startupPitch})

Requirements:
1. Under 90 words (LinkedIn InMail / Connection request friendly).
2. Friendly, crisp, non-spammy, highlighting mutual alignment.
3. Include a low-friction CTA (e.g. 15-min casual coffee or video call).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ dmText: response.text });
  } catch (error: any) {
    console.error("Draft DM Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// Serve frontend with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
