import { LeadItem } from '../types';

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    title: 'Full-Stack React + Node Developer Needed for AI SaaS Dashboard Integration',
    source: 'Upwork Feed',
    category: 'Web Development',
    budget: 3500,
    estDays: 7,
    matchScore: 94,
    description: 'We are looking for a skilled developer to build a high-performance React dashboard connected to OpenAI & Firebase backends. Must support real-time data streaming and glassmorphism styling.',
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'OpenAI API', 'Tailwind/CSS'],
    status: 'analyzed',
    clientName: 'Nexus AI Labs',
    clientLocation: 'San Francisco, CA',
    postedTime: '12 minutes ago',
    proposal: {
      coverLetter: `Hi Nexus AI Team,\n\nI reviewed your requirements for the AI SaaS Dashboard integration and can deliver a ultra-responsive React + TypeScript solution with streaming OpenAI responses.\n\nHaving built similar real-time glassmorphism dashboards, I can ensure crisp UI, optimized state management, and 99.9% uptime. Ready to start immediately.`,
      estimatedPrice: 3500,
      timeline: '6 days',
      keyDeliverables: [
        'Responsive React + TypeScript Dashboard',
        'OpenAI SSE Streaming Integration',
        'Firebase Auth & Analytics Setup',
        'Clean Documentation & Code Handoff'
      ]
    }
  },
  {
    id: 'lead-102',
    title: 'Custom Webhook Automation & Lead Scraping Pipeline for FinTech Startup',
    source: 'RemoteOK RFP',
    category: 'Automation & Scraping',
    budget: 2200,
    estDays: 4,
    matchScore: 89,
    description: 'Need an automated script/agent to poll public market signals, aggregate data into PostgreSQL, and send instant alerts to Discord and Email.',
    skillsRequired: ['Python', 'Node.js', 'Webhooks', 'PostgreSQL', 'Discord API'],
    status: 'new',
    clientName: 'Alpha Capital Tech',
    clientLocation: 'London, UK',
    postedTime: '45 minutes ago'
  },
  {
    id: 'lead-103',
    title: 'Fix Bug & Implement WebSockets in Open Source Trading Terminal',
    source: 'GitHub Bounties',
    category: 'Bug Fix & Bounties',
    budget: 850,
    estDays: 2,
    matchScore: 98,
    description: 'Bounty reward for resolving memory leak in chart renderer and enabling low-latency WebSocket order book updates.',
    skillsRequired: ['TypeScript', 'WebSockets', 'Canvas API', 'Performance Tuning'],
    status: 'pitch_generated',
    clientName: 'OpenTrade Foundation',
    clientLocation: 'Global / Remote',
    postedTime: '2 hours ago',
    proposal: {
      coverLetter: `Hello OpenTrade Maintainers,\n\nI identified the leak in canvas event listeners and have a tested patch for zero-lag WebSocket frame processing. I can submit a PR within 24 hours.`,
      estimatedPrice: 850,
      timeline: '24 hours',
      keyDeliverables: [
        'Memory leak patch in chart engine',
        'Optimized WebSocket frame buffer',
        'Comprehensive Unit Test coverage'
      ]
    }
  },
  {
    id: 'lead-104',
    title: 'AI Chatbot Setup & Custom Lead Capture Widget for MedSpa Chain',
    source: 'WeWorkRemotely',
    category: 'Client Widget / SaaS',
    budget: 4000,
    estDays: 10,
    matchScore: 92,
    description: 'Looking for a turnkey AI booking assistant that can be embedded on 4 clinic sites to capture patient inquiries and schedule consultations automatically.',
    skillsRequired: ['JavaScript', 'Embeddable Widgets', 'Twilio / SMS', 'Calendar API'],
    status: 'submitted',
    clientName: 'Radiant Aesthetics Group',
    clientLocation: 'Miami, FL',
    postedTime: '3 hours ago',
    proposal: {
      coverLetter: `Dear Radiant Aesthetics Team,\n\nOur White-Label AI Booking Assistant is designed specifically for healthcare & aesthetic clinics. It automates consultation bookings 24/7 and syncs directly with your scheduling calendar.`,
      estimatedPrice: 4000,
      timeline: '8 days',
      keyDeliverables: [
        'Custom-branded embeddable AI Widget',
        'Automated lead qualification engine',
        'SMS confirmation setup via Twilio',
        'Staff Dashboard for Lead Management'
      ]
    }
  }
];

export async function fetchLiveLeads(minBudget: number = 500): Promise<LeadItem[]> {
  // Simulate network request to aggregate public job feeds
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newScrapedLead: LeadItem = {
    id: `lead-${Date.now()}`,
    title: `Autonomous AI Scraping & Data Aggregator for E-Commerce Brand`,
    source: 'Upwork Feed',
    category: 'Automation & AI',
    budget: Math.floor(Math.random() * 3000) + 1500,
    estDays: Math.floor(Math.random() * 5) + 3,
    matchScore: Math.floor(Math.random() * 15) + 85,
    description: 'Seeking a freelance engineer to build an automated price monitoring bot that alerts Slack when competitor prices drop below threshold.',
    skillsRequired: ['Node.js', 'Puppeteer', 'Slack API', 'JSON Webhooks'],
    status: 'new',
    clientName: 'Global Brands Direct',
    clientLocation: 'New York, NY',
    postedTime: 'Just now'
  };

  return [newScrapedLead, ...INITIAL_LEADS].filter((l) => l.budget >= minBudget);
}

export function generateLeadProposal(lead: LeadItem): LeadItem {
  const coverLetter = `Dear ${lead.clientName || 'Hiring Team'},\n\nI read your request regarding "${lead.title}" with great interest. My expertise in ${lead.skillsRequired.slice(0, 3).join(', ')} aligns directly with your project requirements.\n\nI can execute this project efficiently within ${lead.estDays} days, focusing on high reliability, robust error handling, and scalable delivery.\n\nLet us connect to discuss your exact specifications!`;

  return {
    ...lead,
    status: 'pitch_generated',
    proposal: {
      coverLetter,
      estimatedPrice: lead.budget,
      timeline: `${lead.estDays} business days`,
      keyDeliverables: [
        `Complete implementation of ${lead.title}`,
        'Thorough QA testing & security validation',
        'Comprehensive user guide and source code transfer'
      ]
    }
  };
}
