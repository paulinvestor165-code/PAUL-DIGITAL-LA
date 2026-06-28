import { Service, Project, TeamMember, CaseStudy, Testimonial, BlogPost, Job, FAQItem } from "../types";

export const mockServices: Service[] = [
  // Engineering
  {
    id: "srv-1",
    name: "Corporate Website Development",
    category: "Engineering",
    description: "High-contrast, mobile-first responsive corporate hubs built with React 19, custom Vite bundlers, and fully SEO-structured metadata.",
    priceEstimate: "$4,500+",
    features: ["Responsive Grid Design", "W3C Validation", "Apple-Level Fluid Transitions", "Custom Headless CMS"]
  },
  {
    id: "srv-2",
    name: "E-commerce Development",
    category: "Engineering",
    description: "High-performance headless storefronts integrating Shopify Plus or custom Stripe APIs. Extremely fast checkouts that double conversion rates.",
    priceEstimate: "$7,500+",
    features: ["Instant Search Integration", "Zero-flicker Cart Management", "Multi-Currency Checkout", "Automated Inventory Sync"]
  },
  {
    id: "srv-3",
    name: "Landing Pages",
    category: "Engineering",
    description: "Premium single-page pipelines designed for precise ad traffic. Laser-focused visual rhythm and micro-animations that maximize conversion.",
    priceEstimate: "$1,800+",
    features: ["A/B Testing Framework", "Ultra-Light Asset Bundle", "Lead Capturing Mechanics", "Interactive Schedulers"]
  },
  {
    id: "srv-4",
    name: "SaaS Development",
    category: "Engineering",
    description: "Comprehensive end-to-end cloud platforms. Custom role authentication, complex dashboard telemetry charts, and automated subscription setups.",
    priceEstimate: "$12,000+",
    features: ["Role-Based Authorization", "Real-time Charting Suite", "Multi-tenant Architecture", "Stripe Billing Integrations"]
  },
  {
    id: "srv-5",
    name: "Mobile Apps",
    category: "Engineering",
    description: "Native iOS & Android mobile software crafted with React Native. Silky-smooth gestures and persistent offline data caches.",
    priceEstimate: "$15,000+",
    features: ["Biometric FaceID Login", "Push Notification Channels", "Local SQL Sync", "Cross-Platform Build Native"]
  },

  // Design
  {
    id: "srv-6",
    name: "UI/UX Design",
    category: "Design",
    description: "Deliberate design systems prioritizing visual balance, gorgeous Space Grotesk headings, micro-interactions, and premium layout densities.",
    priceEstimate: "$3,500+",
    features: ["Interactive Figma Prototypes", "Custom Vector Icon System", "Strict Layout Grid System", "High-Contrast Verification"]
  },
  {
    id: "srv-7",
    name: "Brand Identity",
    category: "Design",
    description: "Defining the cohesive mood, tone, and guidelines of your digital brand. Premium typography systems, color specs, and asset palettes.",
    priceEstimate: "$4,000+",
    features: ["Complete Brand Style Guide", "Tailwind Theme Definitions", "Corporate Typography Standards", "Digital Logo Variants"]
  },
  {
    id: "srv-8",
    name: "Logo Design",
    category: "Design",
    description: "Luxury vector logomarks designed from grid geometry. Modern, timeless, and optimized for high-resolution screens and app icon specs.",
    priceEstimate: "$1,500+",
    features: ["Golden Ratio Math", "High-Resolution SVG Output", "Dark / Light Optimized Grid", "Trademark-Ready Identity"]
  },
  {
    id: "srv-9",
    name: "Graphic Design",
    category: "Design",
    description: "Elite visual collateral: custom newsletter vectors, social media headers, pitch decks, and company report brochures.",
    priceEstimate: "$1,200+",
    features: ["Bespoke Visual Infographics", "Social Content Templates", "Print-Ready Output Specs", "Corporate Pitch Graphics"]
  },

  // Growth Marketing
  {
    id: "srv-10",
    name: "Search Engine Optimization (SEO)",
    category: "Growth",
    description: "Advanced semantic optimizations. Structured data schemas, Google Search Console index guarantees, and comprehensive keyword content pillars.",
    priceEstimate: "$2,500/mo",
    features: ["Schema Markup Automation", "Core Web Vitals Audit", "Backlink Strategy Campaigns", "Monthly SERP Analytics Reports"]
  },
  {
    id: "srv-11",
    name: "Google Ads",
    category: "Growth",
    description: "Laser-targeted pay-per-click search and display campaigns designed to acquire ready-to-buy commercial clients.",
    priceEstimate: "$1,500/mo+",
    features: ["High-Intent Match Keywords", "Custom Direct Landing Pages", "Conversion Tracking Sync", "Ad Copy Optimization"]
  },
  {
    id: "srv-12",
    name: "Facebook & Instagram Ads",
    category: "Growth",
    description: "Bespoke social ad campaigns targeting specific interest-brackets. Includes high-converting visual ads and pixel attribution.",
    priceEstimate: "$1,800/mo+",
    features: ["A/B Creative Video Assets", "Meta Pixel Event Tuning", "Lookalike Audience Modeling", "Re-targeting Funnels"]
  },
  {
    id: "srv-13",
    name: "TikTok Ads",
    category: "Growth",
    description: "High-energy, natively styled video ads that tap into trending audio formats and viral demographic hooks.",
    priceEstimate: "$2,000/mo+",
    features: ["Viral Format Adaptability", "Dynamic Creative Ad Sets", "Pixel Event Optimization", "Influencer Style Assets"]
  },
  {
    id: "srv-14",
    name: "Email Marketing",
    category: "Growth",
    description: "Custom-tailored lead-nurturing funnels. Exquisite copywriting, clean layouts, and automated drip triggers.",
    priceEstimate: "$1,200/mo",
    features: ["Drip Sequence Automation", "Active Audience Segmentation", "Responsive Newsletter Code", "Dynamic Personalization"]
  },
  {
    id: "srv-15",
    name: "Social Media Management",
    category: "Growth",
    description: "Consistent organic publishing. Curating the expert voice of your brand across LinkedIn, Twitter, and Instagram.",
    priceEstimate: "$2,000/mo",
    features: ["Custom Social Media Copy", "Aesthetic Uniform Grid Layout", "Direct Message Lead Funnels", "Weekly Growth Telemetry"]
  },

  // AI & Automation
  {
    id: "srv-16",
    name: "AI Chatbots",
    category: "AI & Automation",
    description: "Enterprise chatbots trained on custom service manuals, deployed on your React website. Directly synchronized with sales pipelines.",
    priceEstimate: "$3,000+",
    features: ["Gemini Server Integrations", "Custom Knowledge Embeddings", "Secure Webhook Triggers", "Visual Lead Capturing Forms"]
  },
  {
    id: "srv-17",
    name: "AI Customer Support",
    category: "AI & Automation",
    description: "Automated support desks that answer common tickets, process refunds, and book discovery calls, saving up to 80% on overhead.",
    priceEstimate: "$4,500+",
    features: ["Multilingual Context Handling", "Zendesk/Salesforce Integrations", "Ticket Escalate Routing", "Continuous Tuning Dashboard"]
  },
  {
    id: "srv-18",
    name: "AI Voice Agents",
    category: "AI & Automation",
    description: "Intelligent, natural-sounding voice software to automate outbound inquiries, answer calls, or manage booking confirmations.",
    priceEstimate: "$6,000+",
    features: ["Sub-Second Audio Latency", "CRM Auto-transcription", "Interactive Voice Trees", "Dynamic Calendar Sync"]
  },
  {
    id: "srv-19",
    name: "Business Automation",
    category: "AI & Automation",
    description: "Synchronizing software infrastructure. Fully automatic Zapier, Make, or custom API links that run administrative duties 24/7.",
    priceEstimate: "$3,500+",
    features: ["No-Code Tool Connectivity", "Error Catch Notifications", "Multi-stage Conditional Logic", "Secure Server Cron Jobs"]
  },
  {
    id: "srv-20",
    name: "CRM Integration",
    category: "AI & Automation",
    description: "Flawless connections linking landing pages to Salesforce, HubSpot, or custom databases with secure token management.",
    priceEstimate: "$2,500+",
    features: ["HubSpot/Salesforce API Sync", "Secure Client Token Vaults", "Dynamic Sales Pipeline Sync", "Instant Slack Lead Alerts"]
  },

  // Cyber & Cloud
  {
    id: "srv-21",
    name: "Website Maintenance",
    category: "Cyber & Cloud",
    description: "Continuous software checkups. Weekly library updates, instant server status checks, and backup management.",
    priceEstimate: "$499/mo",
    features: ["Weekly Core Dependency Updates", "Uptime Monitoring Systems", "Automatic Cloud Backup Routine", "Emergency Hotfixes"]
  },
  {
    id: "srv-22",
    name: "Website Speed Optimization",
    category: "Cyber & Cloud",
    description: "Achieve a solid 99 score on Google Lighthouse. Compressing media assets, bundling code, and configuring Edge CDNs.",
    priceEstimate: "$1,500+",
    features: ["Core Web Vitals Optimizations", "Edge Cache Configurations", "Dynamic Image Compression", "Critical CSS Code Splitting"]
  },
  {
    id: "srv-23",
    name: "Cybersecurity Audit",
    category: "Cyber & Cloud",
    description: "Comprehensive audits detecting XSS risks, SQL injection leaks, and third-party script vulnerabilities.",
    priceEstimate: "$4,000+",
    features: ["Vulnerability Port Scanning", "XSS & CSRF Attack Defense", "Secure Header Audits", "Staff Security Training Guide"]
  },
  {
    id: "srv-24",
    name: "Cloud Hosting",
    category: "Cyber & Cloud",
    description: "Enterprise container hosting on Google Cloud Platform, using Cloud Run, Nginx proxies, and globally distributed CDNs.",
    priceEstimate: "$199/mo+",
    features: ["Automated SSL Configurations", "Microservices Containering", "GCP Edge Network CDN", "Server Auto-Scaling Specs"]
  }
];

export const mockPortfolio: Project[] = [
  {
    id: "port-1",
    title: "Apex Ventures Cloud Platform",
    category: "Web Development",
    clientName: "Apex Ventures Inc",
    description: "An elegant, luxurious React application showcasing portfolio analytics, interactive tables, and custom asset reports.",
    stats: { label: "Performance Score", value: "99/100" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    tags: ["React 19", "Express", "D3.js Charts", "Tailwind CSS"]
  },
  {
    id: "port-2",
    title: "Nova Headless Storefront",
    category: "E-commerce",
    clientName: "Nova Retail Group",
    description: "High-speed custom storefront connected to a headless Shopify framework. Reached an ultra-fast 0.4s load time.",
    stats: { label: "Conversion Rate Up", value: "+142%" },
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js Concept", "Stripe API", "Vite", "Tailwind CSS"]
  },
  {
    id: "port-3",
    title: "Rostov Luxury Real Estate",
    category: "Branding",
    clientName: "Rostov Real Estate LLC",
    description: "A gorgeous luxury branding guide and corporate interactive website for a premier real estate conglomerate in Europe.",
    stats: { label: "Digital Leads Secured", value: "3.2x Increase" },
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    tags: ["Brand Identity", "Figma", "Webflow Custom", "Framer Motion"]
  },
  {
    id: "port-4",
    title: "Intelligent Customer Support Engine",
    category: "AI Automation",
    clientName: "MediCare Direct Group",
    description: "Implemented a fully HIPAA-compliant Gemini API chatbot to answer patient inquiries and automate doctor schedules.",
    stats: { label: "Support Overhead Down", value: "-68%" },
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    tags: ["Gemini-3.5-Flash", "HIPAA Proxy", "Dynamic Calendar Sync"]
  },
  {
    id: "port-5",
    title: "Acme Global Ad Funnel",
    category: "Growth Marketing",
    clientName: "Acme Global Co",
    description: "A multi-stage ad campaign linking custom single-page ad traps directly to a customized automated CRM sequence.",
    stats: { label: "Ad Spend Return (ROAS)", value: "5.4x" },
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f311?q=80&w=800&auto=format&fit=crop",
    tags: ["Google Ads", "TikTok Funnels", "HubSpot API"]
  }
];

export const mockCaseStudies: CaseStudy[] = [
  {
    id: "cs-1",
    title: "Apex Ventures SaaS Migration Strategy",
    client: "Apex Ventures Inc",
    category: "Web Development",
    challenge: "Apex Ventures was running on a slow PHP backend that frequently crashed during heavy traffic cycles, causing high customer dropoffs.",
    solution: "We engineered a modular React 19 single-page app bundled via Vite, paired with a scalable Express microservice. We integrated fully reactive D3 dashboard charts.",
    results: [
      "Load times plummeted from 4.2 seconds to 0.5 seconds.",
      "Customer satisfaction dashboard scores elevated by 94%.",
      "Zero server crash events recorded during peak funding announcements."
    ],
    metric: "99/100",
    metricLabel: "Core Web Vitals"
  },
  {
    id: "cs-2",
    title: "Scaling Headless E-commerce for Nova Retail",
    client: "Nova Retail Group",
    category: "E-commerce",
    challenge: "Nova Retail wanted to scale their catalog to over 50,000 product variants while maintaining lightning-fast search capabilities.",
    solution: "Built an ultra-fast headless storefront backed by an automated Redis inventory synchronizer and client-side cached route transitions.",
    results: [
      "Cart checkout conversion improved by 142%.",
      "Search results return in under 30 milliseconds.",
      "Total checkout abandonment dropped by 38%."
    ],
    metric: "+142%",
    metricLabel: "Sales Conversions"
  },
  {
    id: "cs-3",
    title: "Automating 68% Customer Desk Support",
    client: "MediCare Direct Group",
    category: "AI Automation",
    challenge: "MediCare's administrative team spent 14 hours daily responding manually to simple questions, postponing urgent critical operations.",
    solution: "We deployed our bespoke Gemini-powered support bot, trained on HIPAA manuals, featuring automatic calendar meeting schedulers.",
    results: [
      "Secured a 68% overhead reduction in under 4 weeks.",
      "Automatic doctor consults increased by 22%.",
      "Patients received instantaneous answers 24/7."
    ],
    metric: "-68%",
    metricLabel: "Manual Overhead"
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    name: "Paul",
    role: "CEO & Chief Digital Strategist",
    bio: "Visionary technical leader with 15+ years of digital architecture expertise. Paul directs the core engineering standards and growth paradigms.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Alex Vance",
    role: "Senior Software Architect",
    bio: "Elite modular engineer specializing in ultra-fast React systems, secure Node API routers, and scale-to-zero server containers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Sarah Lin",
    role: "UI/UX Creative Director",
    bio: "Award-winning designer with a profound love for Space Grotesk typography, optimal whitespace, and luxurious micro-animations.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Marcus Sterling",
    role: "Director of Paid Growth",
    bio: "Funnels mastermind managing millions in annual ad spend across Google, Meta, and TikTok with a strict focus on positive ROAS.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "tst-1",
    name: "Sarah Jenkins",
    role: "Chief Operating Officer",
    company: "Apex Ventures Inc",
    content: "Paul Digital Labs transformed our digital product from a slow prototype into a lightning-fast enterprise app. The client onboarding portal was incredible and allowed us to sign proposals and review designs in one sleek workspace.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "tst-2",
    name: "Michael Chen",
    role: "VP of E-commerce Strategy",
    company: "Nova Retail Group",
    content: "The headless storefront built by Paul and his team is remarkably fast. Load times are non-existent, and our checkout conversions spiked by 142%. Absolute Apple-level standards in code and styling.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "tst-3",
    name: "Dr. Elena Rostova",
    role: "Chief Product Officer",
    company: "MediCare Direct Group",
    content: "We were highly skeptical about integrating AI, but the Gemini assistant built by Paul Digital Labs operates flawlessly, answers patients securely, and slashed our operations overhead by 68%. Truly world-class.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
  }
];

export const mockFAQ: FAQItem[] = [
  {
    category: "General",
    question: "Who is Paul Digital Labs?",
    answer: "Paul Digital Labs is a premier, AI-powered international digital agency founded by Paul. We specialize in custom React/TypeScript engineering, premium brand design, HIPAA/GDPR automation platforms, and conversion-optimized growth marketing campaigns."
  },
  {
    category: "Technology",
    question: "What technology stack do you deploy for custom websites?",
    answer: "Our default stack is built on React 19 and Vite for frontend applications, styled with utility-first Tailwind CSS. Backends utilize Express.js running on Node.js. For persistent databases, we integrate Google Firestore (Enterprise Edition) or high-availability PostgreSQL networks."
  },
  {
    category: "AI Integration",
    question: "Is our business data secure when utilizing your custom Gemini assistants?",
    answer: "Absolutely. All Gemini integrations are orchestrated server-side via Node API proxies. We never expose client API keys, nor do we send sensitive enterprise data to public models without strict attribute-based security parameters."
  },
  {
    category: "Process & Booking",
    question: "How do we track the status of our projects?",
    answer: "Every client gets instant access to our interactive Client Dashboard. Inside, you can review contracts, sign branding proposals, download PDF invoices, and chat directly with your assigned project manager in real-time."
  },
  {
    category: "Pricing & Payments",
    question: "What payment systems do you support?",
    answer: "We support Stripe, PayPal, Flutterwave, and Paystack for international clients, along with direct corporate bank transfers. Payment milestones are automated through the Client Dashboard."
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "The Shift to React 19 & Vite in Enterprise Development",
    category: "Engineering",
    excerpt: "Why the classic Webpack setup is officially dead, and how React 19's direct compiler integration is saving enterprises thousands in dev ops costs.",
    content: "Webpack represented an important historical chapter, but in 2026, Vite's native ES module bundling represents the only viable baseline. Learn how we optimized loading speeds to 0.4 seconds...",
    date: "June 25, 2026",
    readTime: "5 min read",
    author: "Alex Vance",
    tags: ["React 19", "Vite", "Web Performance"]
  },
  {
    id: "post-2",
    title: "Unlocking 142% Checkout Conversions on Headless Storefronts",
    category: "E-commerce",
    excerpt: "A data-driven breakdown of how minor layout improvements, instant search bars, and localized state handling affect premium e-commerce pipelines.",
    content: "Conversion is not an accident; it is the mathematical consequence of visual density, speed, and trust indicators. In this guide, we analyze the checkout flows of top brands...",
    date: "June 26, 2026",
    readTime: "7 min read",
    author: "Paul",
    tags: ["E-commerce", "Stripe", "Conversion Optimization"]
  },
  {
    id: "post-3",
    title: "Deploying Custom AI Chatbots in Highly Regulated Markets",
    category: "AI Automation",
    excerpt: "How to safely leverage the @google/genai SDK to deploy customer desks while complying with strict HIPAA and GDPR security rules.",
    content: "AI chatbots are revolutionary, but direct client-side integration exposes key secrets. By isolating calls inside an Express backend proxy and implementing robust data cleansing...",
    date: "June 27, 2026",
    readTime: "6 min read",
    author: "Alex Vance",
    tags: ["AI Automation", "Gemini", "GDPR Security"]
  }
];

export const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer (React & Express)",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$120,000 - $150,000 USD",
    description: "We are seeking an elite TypeScript engineer to build world-class SaaS platforms, headless storefronts, and client-facing dashboards.",
    requirements: [
      "5+ years of production experience in React & Node.js environments.",
      "Expert knowledge of Tailwind CSS and custom Vite configurations.",
      "Strong familiarity with the @google/genai SDK and secure token storage."
    ]
  },
  {
    id: "job-2",
    title: "Mid UI/UX Graphic Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Contract-to-Hire",
    salary: "$80,000 - $100,000 USD",
    description: "Join our creative squad and draft high-contrast Apple-level dashboards, luxurious branding decks, and responsive logo marks.",
    requirements: [
      "Expert portfolio displaying mastery of whitespace, typography, and dark-mode styling.",
      "High proficiency with Figma, vector rendering, and animation transitions.",
      "Ability to define clean Tailwind-compliant color palettes."
    ]
  }
];
